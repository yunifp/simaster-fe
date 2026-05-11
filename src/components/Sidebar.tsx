/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronDown, Loader2, Circle } from 'lucide-react';
import { api } from '../services/api';
import kpuLogo from '../assets/logo_kpu.png';

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed
}) => {
    const location = useLocation();
    const [menus, setMenus] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

    const renderIcon = (iconName: string | null) => {
        if (!iconName) return <Circle size={14} />;
        const LucideIcon = (Icons as any)[iconName];
        return LucideIcon ? <LucideIcon size={20} /> : <Icons.HelpCircle size={20} />;
    };

    useEffect(() => {
        const fetchMyMenus = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/menus/my-menus');
                setMenus(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyMenus();
    }, []);

    useEffect(() => {
        if (menus.length > 0) {
            menus.forEach((menu: any) => {
                const isChildActive = menu.children?.some((c: any) => c.path === location.pathname);
                if (isChildActive) {
                    setOpenSubmenus((prev) => prev.includes(menu.id) ? prev : [...prev, menu.id]);
                }
            });
        }
    }, [location.pathname, menus]);

    const toggleSubmenu = (id: string) => {
        if (isCollapsed) setIsCollapsed(false);
        setOpenSubmenus((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const batikPattern = "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v40c-11.046 0-20-8.954-20-20zM0 20c0 11.046 8.954 20 20 20V0C8.954 0 0 8.954 0 20z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")";

    return (
        <>
            {isMobileOpen && (
                <div className="fixed inset-0 bg-[#300000]/80 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-[#500000] to-[#300000] text-white transition-all duration-300 flex flex-col
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-[10px_0_30px_rgba(0,0,0,0.3)] overflow-hidden`}
            >
                <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0" 
                    style={{ backgroundImage: batikPattern, backgroundSize: '40px 40px' }}
                ></div>

                <div className={`h-16 flex items-center bg-[#400000]/80 backdrop-blur-md border-b border-white/10 z-10 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`bg-white rounded-lg flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all ${isCollapsed ? 'w-9 h-9' : 'w-10 h-10'}`}>
                            <img src={kpuLogo} alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter leading-none text-white drop-shadow-md">
                                    SI<span className="text-yellow-400">MASTER</span>
                                </span>
                                <span className="text-[9px] font-bold text-yellow-400/90 uppercase tracking-[0.2em] mt-0.5">
                                    Data KPU RI
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar z-10 relative">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="animate-spin text-yellow-400" size={28} />
                        </div>
                    ) : (
                        <ul className="space-y-1.5 px-3">
                            {menus.map((menu) => {
                                const isOpen = openSubmenus.includes(menu.id);
                                const hasChildren = menu.children && menu.children.length > 0;
                                const isParentActive = location.pathname === menu.path || menu.children?.some((c: any) => c.path === location.pathname);

                                return (
                                    <li key={menu.id}>
                                        {hasChildren ? (
                                            <div className="mb-1">
                                                <button
                                                    onClick={() => toggleSubmenu(menu.id)}
                                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 
                                                    ${isParentActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-red-100/80 hover:bg-white/5 hover:text-white'}
                                                    ${isCollapsed ? 'justify-center' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`${isParentActive ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''} transition-all`}>
                                                            {renderIcon(menu.icon)}
                                                        </span>
                                                        {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">{menu.title}</span>}
                                                    </div>
                                                    {!isCollapsed && (
                                                        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-yellow-400' : 'text-red-200/50'}`} />
                                                    )}
                                                </button>

                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && !isCollapsed ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                                    <ul className="space-y-1 border-l border-white/10 ml-6 pl-3">
                                                        {menu.children.map((child: any) => {
                                                            const isChildActive = location.pathname === child.path;
                                                            return (
                                                                <li key={child.id} className="relative">
                                                                    {isChildActive && (
                                                                        <div className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                                                                    )}
                                                                    <Link
                                                                        to={child.path}
                                                                        onClick={() => setIsMobileOpen(false)}
                                                                        className={`block px-3 py-2.5 text-[11px] font-bold uppercase rounded-lg transition-all duration-200
                                                                        ${isChildActive ? 'text-yellow-300 bg-white/10 shadow-sm' : 'text-red-100/60 hover:text-white hover:bg-white/5'}`}
                                                                    >
                                                                        {child.title}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={menu.path || '#'}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 mb-1
                                                ${location.pathname === menu.path 
                                                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-[0_4px_15px_rgba(202,138,4,0.4)] border border-yellow-400/50 font-black' 
                                                    : 'text-red-100/80 hover:bg-white/5 hover:text-white font-bold'
                                                }
                                                ${isCollapsed ? 'justify-center' : ''}`}
                                            >
                                                <span className={location.pathname === menu.path ? 'drop-shadow-md' : ''}>
                                                    {renderIcon(menu.icon)}
                                                </span>
                                                {!isCollapsed && <span className="text-xs uppercase tracking-wider drop-shadow-sm">{menu.title}</span>}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </nav>

                <div className="p-5 bg-[#300000]/60 backdrop-blur-md border-t border-white/10 z-10 relative">
                    {!isCollapsed ? (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[9px] font-black text-yellow-400/80 uppercase tracking-[0.25em]">Sistem Master Data</p>
                            <p className="text-[8px] font-bold text-red-200/40 uppercase tracking-widest mt-1">Versi 2.0.0 &copy; 2026</p>
                        </div>
                    ) : (
                        <div className="flex justify-center text-red-200/40"><Icons.Info size={16} /></div>
                    )}
                </div>
            </aside>
        </>
    );
};