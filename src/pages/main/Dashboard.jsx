import { useState, useEffect } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaCheckCircle, FaClock } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../services/supabaseClient";

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const { data: orders, error } = await supabase
                    .from('orders')
                    .select('*, profiles(full_name)')
                    .order('created_at', { ascending: false });

                if (!error && orders) {
                    const total = orders.length;
                    const completed = orders.filter(o => o.status === 'completed').length;
                    const cancelled = orders.filter(o => o.status === 'cancelled').length;
                    const revenue = orders
                        .filter(o => o.status === 'completed')
                        .reduce((sum, o) => sum + Number(o.final_amount || 0), 0);

                    setStats({ total, completed, cancelled, revenue });
                    setRecentOrders(orders.slice(0, 5));
                }
            } catch (err) {
                console.error('Error loading dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

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
            <PageHeader title="Dashboard" breadcrumb={["Home", "Dashboard"]} />

            <div id="dashboard-container" className="space-y-8">
                <div id="dashboard-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div id="dashboard-orders" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <FaShoppingCart className="text-xl" />
                            </div>
                            <div>
                                <span id="orders-count" className="text-2xl font-bold text-gray-800">{stats.total}</span>
                                <span id="orders-text" className="block text-xs text-gray-400">Total Orders</span>
                            </div>
                        </div>
                    </div>
                    <div id="dashboard-delivered" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                <FaTruck className="text-xl" />
                            </div>
                            <div>
                                <span id="delivered-count" className="text-2xl font-bold text-gray-800">{stats.completed}</span>
                                <span id="delivered-text" className="block text-xs text-gray-400">Total Completed</span>
                            </div>
                        </div>
                    </div>
                    <div id="dashboard-canceled" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                <FaBan className="text-xl" />
                            </div>
                            <div>
                                <span id="canceled-count" className="text-2xl font-bold text-gray-800">{stats.cancelled}</span>
                                <span id="canceled-text" className="block text-xs text-gray-400">Total Cancelled</span>
                            </div>
                        </div>
                    </div>
                    <div id="dashboard-revenue" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <FaDollarSign className="text-xl" />
                            </div>
                            <div>
                                <span id="revenue-amount" className="text-2xl font-bold text-gray-800">Rp {stats.revenue.toLocaleString()}</span>
                                <span id="revenue-text" className="block text-xs text-gray-400">Total Revenue</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 font-barlow">Recent Orders</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Belum ada pesanan.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium tracking-wide">
                                    <tr>
                                        <th className="px-5 py-4 uppercase text-xs">Order ID</th>
                                        <th className="px-5 py-4 uppercase text-xs">Customer</th>
                                        <th className="px-5 py-4 uppercase text-xs">Date</th>
                                        <th className="px-5 py-4 uppercase text-xs">Status</th>
                                        <th className="px-5 py-4 uppercase text-xs text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-blue-50/40 transition-colors">
                                            <td className="px-5 py-4 font-semibold text-gray-900">{order.id.slice(0, 8)}...</td>
                                            <td className="px-5 py-4 text-gray-600">{order.profiles?.full_name || '-'}</td>
                                            <td className="px-5 py-4 text-gray-400">{formatDate(order.created_at)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold
                                                    ${order.status === 'completed'
                                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                                        : order.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-700 border border-red-200'
                                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                                    {order.status === 'completed' ? <FaCheckCircle /> : <FaClock />}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right font-bold text-gray-800">Rp {Number(order.final_amount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
