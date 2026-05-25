import { useState, useEffect } from "react";
import { FaBell, FaSearch, FaHistory, FaMoon, FaSun } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

export default function Header() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Load status dark mode dari localStorage saat pertama kali komponen dirender
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark' || (!savedTheme && document.documentElement.classList.contains('dark'))) {
			document.documentElement.classList.add('dark');
			setIsDarkMode(true);
		} else {
			document.documentElement.classList.remove('dark');
			setIsDarkMode(false);
		}
	}, []);

	// Fungsi merubah status dark mode, class di root html, dan menyimpan di localStorage
	const toggleTheme = () => {
		if (isDarkMode) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
			setIsDarkMode(false);
		} else {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
			setIsDarkMode(true);
		}
	};

	return (
		<div id="header-container">
			{/* Search Bar */}
			<div id="search-bar" className="relative group">
				<input
					id="search-input"
					type="text"
					placeholder="Search Here..."
					onFocus={() => setIsSearchOpen(true)}
					onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
				/>
				<FaSearch id="search-icon" />

				{/* Improvisasi 1: Search Quick Modal Dropdown */}
				{isSearchOpen && (
					<div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200">
						<div className="p-3 text-xs text-gray-400 font-semibold border-b border-gray-50 uppercase tracking-wider">
							Pencarian Terakhir
						</div>
						<ul className="flex flex-col m-0 p-0 text-left">
							<li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer text-gray-600 text-sm transition-colors border-b border-gray-50">
								<FaHistory className="text-gray-300" /> Resep Steak Sapi Lada Hitam
							</li>
							<li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer text-gray-600 text-sm transition-colors border-b border-gray-50">
								<FaHistory className="text-gray-300" /> Kode Promo Pelanggan Baru
							</li>
							<li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer text-gray-600 text-sm transition-colors">
								<FaHistory className="text-gray-300" /> Laporan Penjualan Bulan Maret
							</li>
						</ul>
					</div>
				)}
			</div>

			{/* Icon & Profile Section */}
			<div id="icons-container">
				{/* Dark Mode Toggle */}
				<div
					id="theme-toggle"
					onClick={toggleTheme}
					className="hover:scale-105 transition-transform cursor-pointer"
					title="Toggle Dark Mode"
				>
					{isDarkMode ? <FaSun className="text-yellow-500 text-lg" /> : <FaMoon className="text-lg" />}
				</div>

				{/* Icons */}
				<div id="notification-icon" className="hover:scale-105 transition-transform cursor-pointer">
					<FaBell />
					<span id="notification-badge">50</span>
				</div>
				<div id="chart-icon" className="hover:scale-105 transition-transform cursor-pointer">
					<FcAreaChart />
				</div>
				<div id="settings-icon" className="hover:scale-105 transition-transform cursor-pointer">
					<SlSettings />
				</div>

				{/* Profile Section */}
				<div id="profile-container" className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
					<span id="profile-text">
						Halo, <b>Fauzan</b>
					</span>
					<img
						id="profile-avatar"
						src="/img/wahyu&family.png"
						className="w-10 h-10 rounded-full object-cover shadow-sm"
						alt="Profile avatar"
					/>
				</div>
			</div>
		</div>
	);
}
