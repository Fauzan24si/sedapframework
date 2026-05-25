import PageHeader from "../../components/PageHeader";
import Container from "../../components/Container";

export default function FiturXyz() {
    return (
        <Container>
            <PageHeader 
                title="Fitur Xyz"
                breadcrumb="Dashboard / Fitur Xyz"
            />
            
            <div className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        Ini Halaman Fitur Xyz
                    </h2>
                    <p className="text-gray-600">
                        Halaman ini merupakan template untuk fitur Xyz
                    </p>
                </div>
            </div>
        </Container>
    );
}
