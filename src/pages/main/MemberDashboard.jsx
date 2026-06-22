import { useState, useEffect } from "react";
import { FaStar, FaTrophy, FaShoppingBag, FaCoins } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { ordersAPI } from "../../services/api";
import { getDiscountPercent } from "../../services/api";

const tierConfig = {
    bronze:   { label: "Bronze",   color: "bg-orange-100 text-orange-700 border-orange-300", next: 1000 },
    silver:   { label: "Silver",   color: "bg-gray-100 text-gray-600 border-gray-300",       next: 5000 },
    gold:     { label: "Gold",     color: "bg-yellow-100 text-yellow-700 border-yellow-300", next: 10000 },
    platinum: { label: "Platinum", color: "bg-purple-100 text-purple-700 border-purple-300", next: null },
};

export default function MemberDashboard() {
    const { profile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMyOrders = async () => {
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
            loadMyOrders();
        }
    }, [profile]);

    const tier = tierConfig[profile?.tier] || tierConfig.bronze;
    const discount = getDiscountPercent(profile?.tier);
    const nextTierPoints = tier.next ? tier.next - (profile?.points || 0) : 0;
    const progressPercent = tier.next
        ? Math.min(((profile?.points || 0) / tier.next) * 100, 100)
        : 100;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.final_amount || 0), 0);

    return (
        <div className="space-y-6">
            <PageHeader title="Member Dashboard" breadcrumb={["Home", "Dashboard"]} />

            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Welcome back, {profile?.full_name || 'Member'}!
                </h2>
                <p className="text-gray-500 mt-1">
                    Here's your loyalty summary and order overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tier Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tier.color} border`}>
                            <FaTrophy className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Current Tier</p>
                            <p className={`text-lg font-bold ${tier.color.split(' ')[1]}`}>{tier.label}</p>
                        </div>
                    </div>
                </div>

                {/* Points Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaCoins className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Total Points</p>
                            <p className="text-lg font-bold text-gray-800">{profile?.points || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Discount Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <FaStar className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Discount</p>
                            <p className="text-lg font-bold text-gray-800">{discount}%</p>
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <FaShoppingBag className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">My Orders</p>
                            <p className="text-lg font-bold text-gray-800">{orders.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Tier Progress</h3>
                    {tier.next ? (
                        <span className="text-xs text-gray-400">
                            {nextTierPoints} poin lagi ke {tierConfig[Object.keys(tierConfig)[Object.keys(tierConfig).indexOf(profile?.tier) + 1]]?.label || 'Next Tier'}
                        </span>
                    ) : (
                        <span className="text-xs text-green-600 font-semibold">Max Tier Reached!</span>
                    )}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>0</span>
                    <span>{tier.next ? tier.next.toLocaleString() : 'MAX'}</span>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 font-barlow">My Recent Orders</h2>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">Belum ada pesanan. Yuk mulai order!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                                <tr>
                                    <th className="px-5 py-4 uppercase text-xs">Order ID</th>
                                    <th className="px-5 py-4 uppercase text-xs">Date</th>
                                    <th className="px-5 py-4 uppercase text-xs">Status</th>
                                    <th className="px-5 py-4 uppercase text-xs text-right">Total</th>
                                    <th className="px-5 py-4 uppercase text-xs text-right">Points Earned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-gray-900">
                                            {order.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-5 py-4 text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${statusStyle[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right font-bold text-gray-800">
                                            Rp {Number(order.final_amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-right text-green-600 font-semibold">
                                            +{order.points_earned}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Total Spent */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-sm text-gray-400 uppercase">Total Spent</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">Rp {totalSpent.toLocaleString()}</p>
            </div>
        </div>
    );
}

const statusStyle = {
    completed:  "bg-green-100 text-green-700 border border-green-200",
    pending:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
    processing: "bg-blue-100 text-blue-700 border border-blue-200",
    cancelled:  "bg-red-100 text-red-700 border border-red-200",
};
