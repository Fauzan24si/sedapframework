import { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { customersAPI } from "../../services/api";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

    // Load customers from Supabase
    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await customersAPI.fetchAll();
            setCustomers(data);
        } catch (err) {
            console.error('Error loading customers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await customersAPI.update(editingId, form);
            } else {
                await customersAPI.create(form);
            }
            setForm({ name: "", email: "", phone: "", address: "" });
            setEditingId(null);
            setShowForm(false);
            loadCustomers();
        } catch (err) {
            console.error('Error saving customer:', err);
            alert('Gagal menyimpan data customer.');
        }
    };

    const handleEdit = (customer) => {
        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
        });
        setEditingId(customer.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus customer ini?")) return;
        try {
            await customersAPI.delete(id);
            loadCustomers();
        } catch (err) {
            console.error('Error deleting customer:', err);
            alert('Gagal menghapus data customer.');
        }
    };

    const handleCloseModal = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ name: "", email: "", phone: "", address: "" });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Customer" breadcrumb={["Dashboard", "Customer List"]}>
                <button
                    id="add-button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                    <FaPlus className="text-xs" /> Add New Customer
                </button>
            </PageHeader>

            {/* Modal Form Tambah/Edit Customer */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800 font-barlow">
                                {editingId ? "Edit Customer" : "Tambah Customer Baru"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Customer Name</label>
                                <input
                                    type="text" required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Masukkan nama customer"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="contoh@email.com"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    placeholder="Alamat lengkap"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                                    Batal
                                </button>
                                <button type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-hijau text-white text-sm font-semibold hover:opacity-90 transition">
                                    {editingId ? "Update Customer" : "Simpan Customer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabel Customers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                                <tr>
                                    <th className="px-5 py-4 uppercase text-xs">Nama</th>
                                    <th className="px-5 py-4 uppercase text-xs">Email</th>
                                    <th className="px-5 py-4 uppercase text-xs">Telepon</th>
                                    <th className="px-5 py-4 uppercase text-xs">Alamat</th>
                                    <th className="px-5 py-4 uppercase text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customers.map((c) => (
                                    <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-5 py-4 text-gray-800 font-medium">{c.name}</td>
                                        <td className="px-5 py-4 text-gray-500">{c.email || '-'}</td>
                                        <td className="px-5 py-4 text-gray-500">{c.phone || '-'}</td>
                                        <td className="px-5 py-4 text-gray-500">{c.address || '-'}</td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(c)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
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
