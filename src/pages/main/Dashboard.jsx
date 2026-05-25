import { useState } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaCheckCircle, FaClock } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
    const recentOrders = [
        { id: "#INV-001", customer: "Budi Santoso",  date: "13 Apr 2026", status: "Delivered",  amount: "Rp 250.000" },
        { id: "#INV-002", customer: "Siti Aminah",   date: "13 Apr 2026", status: "Processing", amount: "Rp 120.000" },
        { id: "#INV-003", customer: "John Doe",       date: "12 Apr 2026", status: "Delivered",  amount: "Rp 340.000" },
        { id: "#INV-004", customer: "Ahmad Dahlan",   date: "11 Apr 2026", status: "Processing", amount: "Rp 450.000" },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Dashboard" breadcrumb={["Home", "Dashboard"]} />

            <div id="dashboard-container" className="space-y-8">
                <div id="dashboard-grid">
                    <div id="dashboard-orders" className="hover:-translate-y-1 transition-transform duration-300">
                        <div id="orders-icon"><FaShoppingCart /></div>
                        <div id="orders-info">
                            <span id="orders-count">75</span>
                            <span id="orders-text">Total Orders</span>
                        </div>
                    </div>
                    <div id="dashboard-delivered" className="hover:-translate-y-1 transition-transform duration-300">
                        <div id="delivered-icon"><FaTruck /></div>
                        <div id="delivered-info">
                            <span id="delivered-count">175</span>
                            <span id="delivered-text">Total Delivered</span>
                        </div>
                    </div>
                    <div id="dashboard-canceled" className="hover:-translate-y-1 transition-transform duration-300">
                        <div id="canceled-icon"><FaBan /></div>
                        <div id="canceled-info">
                            <span id="canceled-count">40</span>
                            <span id="canceled-text">Total Canceled</span>
                        </div>
                    </div>
                    <div id="dashboard-revenue" className="hover:-translate-y-1 transition-transform duration-300">
                        <div id="revenue-icon"><FaDollarSign /></div>
                        <div id="revenue-info">
                            <span id="revenue-amount">Rp.128</span>
                            <span id="revenue-text">Total Revenue</span>
                        </div>
                    </div>
                </div>

                {/* Tabel Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 font-barlow">Recent Orders</h2>
                        <button className="text-sm text-hijau font-semibold hover:underline bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            View All
                        </button>
                    </div>
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
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-gray-900">{order.id}</td>
                                        <td className="px-5 py-4 text-gray-600">{order.customer}</td>
                                        <td className="px-5 py-4 text-gray-400">{order.date}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold
                                                ${order.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                                {order.status === 'Delivered' ? <FaCheckCircle /> : <FaClock />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right font-bold text-gray-800">{order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
