import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import maskotImg from '../assets/maskot.png';
import { X, Sparkles } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
      const [showMascot, setShowMascot] = useState(true);
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


            {showMascot && (
                <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end animate-in fade-in zoom-in-95 duration-500 pointer-events-auto">
                    
                    {/* Balon Bicara (Speech Bubble) Emas Interaktif */}
                    <div className="relative mb-3 mr-6 bg-gradient-to-r from-slate-900 to-[#300000] text-white px-4 py-2.5 rounded-2xl border border-yellow-500/40 shadow-2xl max-w-[220px] animate-pulse">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles size={14} className="text-yellow-400" />
                            <span className="text-[10px] font-black text-yellow-400 tracking-wider uppercase">SIMASTER BOTS</span>
                        </div>
                        <p className="text-[11px] leading-tight font-medium text-slate-200">
                            Halo! Ada yang bisa saya bantu hari ini?
                        </p>
                        
                        {/* Segitiga panah balon bicara menunjuk ke maskot */}
                        <div className="absolute -bottom-1.5 right-10 w-3 h-3 bg-[#300000] border-b border-r border-yellow-500/40 transform rotate-45"></div>
                    </div>

                    {/* Kontainer Karakter Maskot (Diperbesar) beserta Tombol X */}
                    <div className="relative group flex items-center justify-center">
                        
                        {/* Pendaran Glow di belakang maskot */}
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full filter blur-lg group-hover:bg-yellow-500/40 transition-all duration-300 animate-pulse"></div>
                        
                        {/* Tombol Close (X) Elegan */}
                        <button 
                            onClick={() => setShowMascot(false)}
                            className="absolute top-0 right-0 z-10 w-6 h-6 bg-white text-slate-700 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 transition-all cursor-pointer transform group-hover:scale-110 active:scale-90"
                            title="Tutup Maskot"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>

                        {/* Gambar Karakter Maskot Diperbesar (w-36 h-36 sm:w-44 sm:h-44) */}
                        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] animate-bounce" style={{ animationDuration: '3.5s' }}>
                            <img 
                                src={maskotImg} 
                                alt="Karakter Maskot SIMASTER" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
};