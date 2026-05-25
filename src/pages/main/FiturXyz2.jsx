import PageHeader from "../../components/PageHeader";
import Container from "../../components/Container";

export default function FiturXyz2() {
    return (
        <Container>
            <PageHeader 
                title="Fitur Xyz2"
                breadcrumb="Dashboard / Fitur Xyz2"
            />
            
            <div className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        Ini Halaman Fitur Xyz2
                    </h2>
                    <p className="text-gray-600">
                        Halaman ini merupakan template untuk fitur Xyz200
                    </p>
                </div>
            </div>
        </Container>
    );
}
