import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("https://dummyjson.com/products")
            .then((response) => {
                if (response.status !== 200) {
                    setError(response.message);
                    return;
                }
                setProducts(response.data.products);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (error) return <div className="text-red-600 p-4">{error}</div>;
    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Products" breadcrumb={["Dashboard", "Products"]} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                            <tr>
                                <th className="px-6 py-4 uppercase text-xs">No</th>
                                <th className="px-6 py-4 uppercase text-xs">Product Name</th>
                                <th className="px-6 py-4 uppercase text-xs">Category</th>
                                <th className="px-6 py-4 uppercase text-xs">Brand</th>
                                <th className="px-6 py-4 uppercase text-xs text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((item, index) => (
                                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/products/${item.id}`} className="text-emerald-400 hover:text-emerald-600 font-semibold hover:underline">
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.brand || "-"}</td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-800">Rp {(item.price * 1000).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
