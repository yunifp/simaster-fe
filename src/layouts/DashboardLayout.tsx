import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const DashboardLayout: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar tetap fixed */}
            <Sidebar
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Kontainer Utama */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
                    isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}
            >
                {/* Header dibuat sticky agar menempel di atas dan mengikuti alur flex-1 */}
                <div className="sticky top-0 z-30">
                    <Header
                        setIsMobileOpen={setIsMobileOpen}
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />
                </div>

                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};