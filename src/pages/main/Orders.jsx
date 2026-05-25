import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import ordersData from "../../data/ordersData";

const statusStyle = {
    Completed:  "bg-green-100 text-green-700 border border-green-200",
    Pending:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Cancelled:  "bg-red-100 text-red-700 border border-red-200",
};

export default function Orders() {
    const [orders, setOrders] = useState(ordersData);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ customer: "", status: "Pending", total: "", date: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newOrder = {
            id: `#ORD-${String(orders.length + 1).padStart(3, "0")}`,
            customer: form.customer,
            status: form.status,
            total: `Rp ${form.total}`,
            date: form.date,
        };
        setOrders([newOrder, ...orders]);
        setForm({ customer: "", status: "Pending", total: "", date: "" });
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            {/* PageHeader dengan children tombol Add New Order */}
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Order List"]}>
                <button
                    id="add-button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                    <FaPlus className="text-xs" /> Add New Order
                </button>
            </PageHeader>

            {/* Modal Form Tambah Order */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800 font-barlow">Tambah Order Baru</h3>
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
                                    value={form.customer}
                                    onChange={e => setForm({ ...form, customer: e.target.value })}
                                    placeholder="Masukkan nama customer"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                >
                                    <option>Pending</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Total Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                                    <input
                                        type="text" required
                                        value={form.total}
                                        onChange={e => setForm({ ...form, total: e.target.value })}
                                        placeholder="250.000"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Order Date</label>
                                <input
                                    type="date" required
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-hijau/20 focus:border-hijau transition"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                                    Batal
                                </button>
                                <button type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-hijau text-white text-sm font-semibold hover:opacity-90 transition">
                                    Simpan Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabel Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                            <tr>
                                <th className="px-5 py-4 uppercase text-xs">Order ID</th>
                                <th className="px-5 py-4 uppercase text-xs">Customer</th>
                                <th className="px-5 py-4 uppercase text-xs">Date</th>
                                <th className="px-5 py-4 uppercase text-xs">Status</th>
                                <th className="px-5 py-4 uppercase text-xs text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, i) => (
                                <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-gray-900">{order.id}</td>
                                    <td className="px-5 py-4 text-gray-600">{order.customer}</td>
                                    <td className="px-5 py-4 text-gray-400">{order.date}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${statusStyle[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right font-bold text-gray-800">{order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
