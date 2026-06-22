import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { ordersAPI } from "../../services/api";

const statusStyle = {
    completed:  "bg-green-100 text-green-700 border border-green-200",
    pending:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
    processing: "bg-blue-100 text-blue-700 border border-blue-200",
    cancelled:  "bg-red-100 text-red-700 border border-red-200",
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStatus, setEditingStatus] = useState(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await ordersAPI.fetchAll();
            setOrders(data);
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setEditingStatus({ orderId, newStatus });
    };

    const handleSaveStatus = async () => {
        if (!editingStatus) return;
        try {
            await ordersAPI.updateStatus(editingStatus.orderId, editingStatus.newStatus);
            if (editingStatus.newStatus === 'completed') {
                await ordersAPI.awardPoints(editingStatus.orderId);
            }
            setEditingStatus(null);
            loadOrders();
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Gagal mengubah status order.');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Orders" breadcrumb={["Dashboard", "Order List"]} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                                <tr>
                                    <th className="px-5 py-4 uppercase text-xs">Order ID</th>
                                    <th className="px-5 py-4 uppercase text-xs">Customer</th>
                                    <th className="px-5 py-4 uppercase text-xs">Date</th>
                                    <th className="px-5 py-4 uppercase text-xs">Status</th>
                                    <th className="px-5 py-4 uppercase text-xs text-right">Total</th>
                                    <th className="px-5 py-4 uppercase text-xs text-right">Points</th>
                                    <th className="px-5 py-4 uppercase text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-gray-900">{order.id.slice(0, 8)}...</td>
                                        <td className="px-5 py-4 text-gray-600">{order.profiles?.full_name || '-'}</td>
                                        <td className="px-5 py-4 text-gray-400">{formatDate(order.created_at)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${statusStyle[order.status] || ''}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right font-bold text-gray-800">Rp {Number(order.final_amount).toLocaleString()}</td>
                                        <td className="px-5 py-4 text-right text-gray-500">{order.points_earned}</td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="text-xs px-2 py-1 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-hijau/20"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                {editingStatus?.orderId === order.id && editingStatus.newStatus !== order.status && (
                                                    <button onClick={handleSaveStatus} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Save">
                                                        <FaCheck />
                                                    </button>
                                                )}
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
