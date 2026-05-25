import React from 'react';

/**
 * PageHeader Component
 * @param {string} title - Judul halaman
 * @param {string|string[]} breadcrumb - Breadcrumb berupa string "A / B" atau array ["A","B"]
 * @param {React.ReactNode} children - Konten action area (tombol, form trigger, dsb.)
 */
export default function PageHeader({ title = "Dashboard", breadcrumb, children }) {
    // Normalisasi breadcrumb: string → split, array → pakai langsung
    const parts = Array.isArray(breadcrumb)
        ? breadcrumb
        : (breadcrumb ? breadcrumb.split(" / ") : []);

    return (
        <div id="pageheader-container">
            <div id="pageheader-left">
                <span id="page-title">{title}</span>

                {/* Breadcrumb Dinamis */}
                <div id="breadcrumb-links">
                    {parts.map((part, index) => (
                        <React.Fragment key={index}>
                            <span id={index === 0 ? "breadcrumb-home" : "breadcrumb-current"}>
                                {part}
                            </span>
                            {index < parts.length - 1 && (
                                <span id="breadcrumb-separator">/</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Slot children untuk action button / form trigger */}
            {children && (
                <div id="action-button">
                    {children}
                </div>
            )}
        </div>
    );
}
