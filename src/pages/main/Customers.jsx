import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import customersData from "../../data/customersData";

const loyaltyStyle = {
    Gold:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Silver: "bg-gray-100 text-gray-600 border border-gray-200",
    Bronze: "bg-orange-100 text-orange-700 border border-orange-200",
};

export default function Customers() {
    const [customers, setCustomers] = useState(customersData);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", loyalty: "Bronze" });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCustomer = {
            id: `C-${String(customers.length + 1).padStart(3, "0")}`,
            name: form.name,
            email: form.email,
            phone: form.phone,
            loyalty: form.loyalty,
        };
        setCustomers([newCustomer, ...customers]);
        setForm({ name: "", email: "", phone: "", loyalty: "Bronze" });
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            {/* PageHeader dengan children tombol Add New Customer */}
            <PageHeader title="Customer" breadcrumb={["Dashboard", "Customer List"]}>
                <button
                    id="add-button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                    <FaPlus className="text-xs" /> Add New Customer
                </button>
            </PageHeader>

            {/* Modal Form Tambah Customer */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800 font-barlow">Tambah Customer Baru</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Body Form */}
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
                                    type="email" required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="contoh@email.com"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel" required
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Loyalty</label>
                                <select
                                    value={form.loyalty}
                                    onChange={e => setForm({ ...form, loyalty: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                >
                                    <option>Bronze</option>
                                    <option>Silver</option>
                                    <option>Gold</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                                    Batal
                                </button>
                                <button type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-hijau text-white text-sm font-semibold hover:opacity-90 transition">
                                    Simpan Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabel Customers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                            <tr>
                                <th className="px-5 py-4 uppercase text-xs">ID</th>
                                <th className="px-5 py-4 uppercase text-xs">Nama</th>
                                <th className="px-5 py-4 uppercase text-xs">Email</th>
                                <th className="px-5 py-4 uppercase text-xs">Telepon</th>
                                <th className="px-5 py-4 uppercase text-xs text-center">Loyalty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((c, i) => (
                                <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-gray-900">{c.id}</td>
                                    <td className="px-5 py-4 text-gray-800 font-medium">{c.name}</td>
                                    <td className="px-5 py-4 text-gray-500">{c.email}</td>
                                    <td className="px-5 py-4 text-gray-500">{c.phone}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${loyaltyStyle[c.loyalty]}`}>
                                            {c.loyalty}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
