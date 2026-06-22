import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { productsAPI } from "../../services/api";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productsAPI.fetchAll();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: form.name, description: form.description, price: parseFloat(form.price), stock: parseInt(form.stock) };
            if (editingId) { await productsAPI.update(editingId, payload); }
            else { await productsAPI.create(payload); }
            handleCloseModal();
            loadProducts();
        } catch (err) { alert('Gagal menyimpan produk: ' + err.message); }
    };

    const handleEdit = (product) => {
        setForm({ name: product.name || "", description: product.description || "", price: product.price || "", stock: product.stock || "" });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;
        try { await productsAPI.delete(id); loadProducts(); }
        catch (err) { alert('Gagal menghapus produk: ' + err.message); }
    };

    const handleCloseModal = () => { setShowForm(false); setEditingId(null); setForm({ name: "", description: "", price: "", stock: "" }); };

    if (error) return <div className="text-red-600 p-4">{error}</div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Products" breadcrumb={["Dashboard", "Products"]}>
                <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 hover:opacity-90 transition-all hover:-translate-y-0.5">
                    <FaPlus className="text-xs" /> Add New Product
                </button>
            </PageHeader>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800 font-barlow">{editingId ? "Edit Product" : "Tambah Product Baru"}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Product Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi produk" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Price (Rp)</label>
                                    <input type="number" required min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="35000" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Stock</label>
                                    <input type="number" required min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="50" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-hijau text-white text-sm font-semibold hover:opacity-90 transition">{editingId ? "Update Product" : "Simpan Product"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                                <tr>
                                    <th className="px-6 py-4 uppercase text-xs">No</th>
                                    <th className="px-6 py-4 uppercase text-xs">Product Name</th>
                                    <th className="px-6 py-4 uppercase text-xs">Description</th>
                                    <th className="px-6 py-4 uppercase text-xs text-right">Price</th>
                                    <th className="px-6 py-4 uppercase text-xs text-center">Stock</th>
                                    <th className="px-6 py-4 uppercase text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/products/${item.id}`} className="text-emerald-400 hover:text-emerald-600 font-semibold hover:underline">{item.name}</Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.description || '-'}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-800">Rp {Number(item.price).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${item.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.stock}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FaEdit /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
