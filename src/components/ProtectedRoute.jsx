import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

        if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Redirect to the home that matches the user's role to avoid redirect loops
        const roleHome = profile.role === 'member' ? '/member' : '/';
        return <Navigate to={roleHome} replace />;
    }

    return children;
}
