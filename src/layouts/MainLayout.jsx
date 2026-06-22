import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-gray-100 min-h-screen flex">
            {/* Overlay gelap saat drawer terbuka di mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 p-4 min-w-0">
                {/* Tombol hamburger, hanya tampil di mobile */}
                <button
                    type="button"
                    className="lg:hidden mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm text-gray-600"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Buka menu"
                >
                    <FaBars />
                </button>
                <Header />
                <Outlet />
            </div>
        </div>
    );
}
