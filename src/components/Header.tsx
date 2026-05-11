import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, Settings, Menu as MenuIcon, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface HeaderProps {
    setIsMobileOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProfileOpen(false);
        logout();
    };

    const batikPattern = "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v40c-11.046 0-20-8.954-20-20zM0 20c0 11.046 8.954 20 20 20V0C8.954 0 0 8.954 0 20z' fill='%23500000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")";

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 relative shadow-sm w-full">
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
                style={{ backgroundImage: batikPattern, backgroundSize: '40px 40px' }}
            ></div>

            <div className="flex items-center gap-5 relative z-10">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-[#500000] border border-slate-200 transition-all shadow-sm"
                >
                    <MenuIcon size={20} />
                </button>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 transition-all shadow-sm"
                >
                    <MenuIcon size={18} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                <div className="hidden sm:flex items-center gap-3 bg-red-50/80 backdrop-blur-sm border border-red-100 px-3 py-1.5 rounded-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[#500000] text-[9px] font-black uppercase tracking-widest">
                        Server Utama KPU
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#500000] to-[#800000] flex items-center justify-center text-white shadow-inner">
                            <UserIcon size={14} />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-wide leading-none">
                                {user?.name || 'Administrator'}
                            </p>
                            <p className="text-[9px] text-amber-600 font-bold mt-1 uppercase tracking-widest leading-none">
                                {user?.roles?.[0]?.name || 'Superadmin'}
                            </p>
                        </div>
                        <ChevronDown size={12} className="hidden md:block text-slate-400 ml-1" />
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                                <div className="flex items-center gap-2 text-[#500000] mb-1.5">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Akses Terverifikasi</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                            </div>

                            <div className="py-2">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors font-bold"
                                >
                                    <Settings size={18} />
                                    Pengaturan Akun
                                </Link>
                            </div>

                            <div className="px-3 pb-2 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-black transition-colors text-xs tracking-wider"
                                >
                                    <LogOut size={16} strokeWidth={2.5} />
                                    KELUAR SISTEM
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};