import { FaThLarge, FaList, FaHeadphonesAlt, FaBoxOpen, FaCubes, FaPlus, FaExclamationCircle, FaLock, FaBan, FaStar } from "react-icons/fa";
import { NavLink } from "react-router-dom";

// Fungsi menuClass menerima props isActive dari NavLink
const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2 font-medium text-decoration-none
    ${isActive
        ? "text-hijau bg-green-200 font-extrabold"
        : "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
    }`;

export default function Sidebar() {
    return (
        <div id="sidebar">
            {/* Logo */}
            <div id="sidebar-logo">
                <span id="logo-title">
                    Sapi Restaurant <b id="logo-dot"></b>
                </span>
                <span id="logo-subtitle">Modern Admin Dashboard</span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu">
                <ul id="menu-list">
                    {/* Menu Utama */}
                    <li>
                        <NavLink id="menu-1" to="/" end className={menuClass}>
                            <FaThLarge />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-2" to="/orders" className={menuClass}>
                            <FaList />
                            <span>Orders</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-3" to="/customers" className={menuClass}>
                            <FaHeadphonesAlt />
                            <span>Customers</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-products" to="/products" className={menuClass}>
                            <FaBoxOpen />
                            <span>Products</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-components" to="/components" className={menuClass}>
                            <FaCubes />
                            <span>Component</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-fitur-xyz" to="/fitur-xyz" className={menuClass}>
                            <FaStar />
                            <span>Fitur Xyz</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-fitur-xyz2" to="/fitur-xyz2" className={menuClass}>
                            <FaStar />
                            <span>Fitur Xyz2</span>
                        </NavLink>
                    </li>

                    {/* Separator */}
                    <li>
                        <div id="menu-separator">
                            <span>Error Pages</span>
                        </div>
                    </li>

                    {/* Menu Error Pages */}
                    <li>
                        <NavLink id="menu-4" to="/error/400" className={menuClass}>
                            <FaExclamationCircle />
                            <span>Error 400</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-5" to="/error/401" className={menuClass}>
                            <FaLock />
                            <span>Error 401</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-6" to="/error/403" className={menuClass}>
                            <FaBan />
                            <span>Error 403</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div id="sidebar-footer">
                <div id="footer-card">
                    <div id="footer-text">
                        <span>Please organize your menus through button below!</span>
                        <div id="add-menu-button">
                            <FaPlus style={{ fontSize: '0.7em' }} /> <span>Add Menus</span>
                        </div>
                    </div>
                    <img id="footer-avatar" src="/img/wahyu.png" alt="Footer avatar" />
                </div>
                <span id="footer-brand">Sedap Restaurant Admin Dashboard</span>
                <p id="footer-copyright">&copy; 2025 All Right Reserved</p>
            </div>
        </div>
    );
}
