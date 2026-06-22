import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { productsAPI } from "../../services/api";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        productsAPI.fetchById(id)
            .then((data) => setProduct(data))
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) return <div className="text-red-600 p-4">{error}</div>;
    if (!product) return <div className="p-4">Loading...</div>;

    return (
        <div className="space-y-6">
            <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                <FaArrowLeft /> Back to Products
            </Link>

            <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-1">Deskripsi: {product.description || '-'}</p>
                <p className="text-gray-600 mb-1">Stok: {product.stock}</p>
                <p className="text-gray-800 font-semibold text-lg">
                    Harga: Rp {Number(product.price).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
