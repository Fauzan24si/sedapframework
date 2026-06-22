import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaBoxOpen } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { ordersAPI } from "../../services/api";

const statusStyle = {
    completed:  "bg-green-100 text-green-700 border border-green-200",
    pending:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
    processing: "bg-blue-100 text-blue-700 border border-blue-200",
    cancelled:  "bg-red-100 text-red-700 border border-red-200",
};

export default function MyOrders() {
    const { profile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await ordersAPI.fetchMine(profile?.id);
                setOrders(data);
            } catch (err) {
                console.error('Error loading orders:', err);
            } finally {
                setLoading(false);
            }
        };
        if (profile?.id) {
            loadOrders();
        }
    }, [profile]);

    const toggleExpand = (orderId) => {
        setExpandedId(expandedId === orderId ? null : orderId);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="My Orders" breadcrumb={["Home", "My Orders"]} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">Belum ada pesanan.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <div key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                {/* Order Header */}
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer"
                                    onClick={() => toggleExpand(order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <FaBoxOpen className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">
                                                Order #{order.id.slice(0, 8)}...
                                            </p>
                                            <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${statusStyle[order.status]}`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold text-gray-800">
                                            Rp {Number(order.final_amount).toLocaleString()}
                                        </span>
                                        {expandedId === order.id ? (
                                            <FaChevronUp className="text-gray-400" />
                                        ) : (
                                            <FaChevronDown className="text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Order Items (expanded) */}
                                {expandedId === order.id && order.order_items && (
                                    <div className="px-5 pb-5">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <table className="w-full text-sm">
                                                <thead className="text-gray-500">
                                                    <tr>
                                                        <th className="text-left pb-2 text-xs uppercase">Product</th>
                                                        <th className="text-center pb-2 text-xs uppercase">Qty</th>
                                                        <th className="text-right pb-2 text-xs uppercase">Harga</th>
                                                        <th className="text-right pb-2 text-xs uppercase">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {order.order_items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="py-2 text-gray-700 font-medium">
                                                                {item.product_id?.slice(0, 8)}...
                                                            </td>
                                                            <td className="py-2 text-center text-gray-500">{item.quantity}</td>
                                                            <td className="py-2 text-right text-gray-500">
                                                                Rp {Number(item.unit_price).toLocaleString()}
                                                            </td>
                                                            <td className="py-2 text-right font-semibold text-gray-800">
                                                                Rp {Number(item.subtotal).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Order Summary */}
                                            <div className="mt-4 pt-3 border-t border-gray-200 space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Subtotal</span>
                                                    <span className="font-semibold">Rp {Number(order.total_amount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Diskon ({order.discount_percent}%)</span>
                                                    <span className="text-green-600 font-semibold">
                                                        -Rp {(Number(order.total_amount) * Number(order.discount_percent) / 100).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                                                    <span>Total</span>
                                                    <span className="text-green-600">Rp {Number(order.final_amount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm bg-blue-50 rounded-lg p-2 mt-2">
                                                    <span className="text-blue-600">Poin Didapat</span>
                                                    <span className="font-bold text-blue-700">+{order.points_earned}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
