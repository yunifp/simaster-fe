/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { 
    MapPin, Activity, KeyRound, GitMerge, 
    Server, Clock, ShieldCheck, TrendingUp, 
    ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const { summary, isLoading, fetchSummary } = useDashboard();
    
    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const userName = "Administrator"; // Sesuaikan dengan state Auth Anda nanti

    return (
        <div className="space-y-8 pb-10">
            {/* HERO WELCOME SECTION (KPU Maroon Vibe) */}
            <div className="bg-gradient-to-br from-[#500000] to-[#300000] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-[#400000]">
                {/* Texture Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                {/* Glowing Orbs - Red & Yellow */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-0 right-80 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-[10px] font-black tracking-widest text-yellow-400 uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                System Online
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-100 mb-2">
                            Selamat Datang, {userName}
                        </h1>
                        <p className="text-red-100/70 text-[15px] leading-relaxed font-medium">
                            Ini adalah Command Center SI-MASTER KPU. Pantau integrasi data kewilayahan nasional, kelola rilis versi, dan awasi lalu lintas M2M secara real-time.
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Data Wilayah */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-red-50 group-hover:text-red-100 transition-colors transform group-hover:scale-110 duration-500"><MapPin size={120} /></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-red-50 text-[#500000] rounded-2xl flex items-center justify-center mb-4 border border-red-100"><MapPin size={24} /></div>
                        <div className="text-3xl font-black text-slate-800">
                            {isLoading ? '...' : summary.totalWilayah.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Data Wilayah</div>
                    </div>
                </div>

                {/* Card 2: Active Version */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-amber-50 group-hover:text-amber-100 transition-colors transform group-hover:scale-110 duration-500"><GitMerge size={120} /></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100"><GitMerge size={24} /></div>
                        <div className="text-3xl font-black text-slate-800">
                            {isLoading ? '...' : summary.activeVersion}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Versi Rilis Aktif</div>
                    </div>
                </div>

                {/* Card 3: API Clients */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-orange-50 group-hover:text-orange-100 transition-colors transform group-hover:scale-110 duration-500"><KeyRound size={120} /></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 border border-orange-100"><KeyRound size={24} /></div>
                        <div className="text-3xl font-black text-slate-800">
                            {isLoading ? '...' : summary.totalApiKeys.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Klien API Aktif</div>
                    </div>
                </div>

                {/* Card 4: Total Requests */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-rose-50 group-hover:text-rose-100 transition-colors transform group-hover:scale-110 duration-500"><Activity size={120} /></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 border border-rose-100"><TrendingUp size={24} /></div>
                        <div className="text-3xl font-black text-slate-800">
                            {isLoading ? '...' : summary.totalLogs.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total API Requests</div>
                    </div>
                </div>
            </div>

            {/* SPLIT PANELS: SERVER HEALTH & LIVE STREAM */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* KIRI: Server Health (Maroon Vibe) */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-[#400000] rounded-3xl p-6 md:p-8 border border-white/10 text-white shadow-xl h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-yellow-400" /> Sistem Status
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-red-100/70 uppercase tracking-wider mb-2">
                                        <span>Database (PostgreSQL)</span>
                                        <span className="text-emerald-400">Optimal</span>
                                    </div>
                                    <div className="w-full bg-[#300000] rounded-full h-2.5 overflow-hidden border border-black/20">
                                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full w-[95%]"></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-red-100/70 uppercase tracking-wider mb-2">
                                        <span>API Rate Limit Status</span>
                                        <span className="text-yellow-400">Aman</span>
                                    </div>
                                    <div className="w-full bg-[#300000] rounded-full h-2.5 overflow-hidden border border-black/20">
                                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full w-[30%]"></div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-8 border-t border-white/10">
                                    <div className="flex items-center gap-4 bg-[#300000]/50 p-4 rounded-2xl border border-white/5">
                                        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><Server size={20} /></div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Express.js Server</div>
                                            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Uptime: 99.9%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KANAN: Live Activity Stream */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full">
                    <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <Activity className="text-[#500000]" /> Live API Activity Stream
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">5 request terakhir yang terekam oleh sistem.</p>
                        </div>
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </div>

                    <div className="p-0 overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {isLoading ? (
                                    <tr><td className="p-10 text-center text-slate-400 font-medium">Memuat stream aktivitas...</td></tr>
                                ) : summary.recentLogs.length > 0 ? summary.recentLogs.map((log) => (
                                    <tr key={log.id_log} className="hover:bg-red-50/30 transition-colors">
                                        <td className="p-4 md:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="shrink-0">
                                                    {log.status_code >= 200 && log.status_code < 300 ? (
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center"><CheckCircle2 size={18}/></div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center"><ShieldAlert size={18}/></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-slate-800">{log.aktor}</span>
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-widest">{log.tipe_aktor}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                                                        {/* Mengubah warna label GET/POST agar sesuai tema maroon */}
                                                        <span className={`px-1.5 py-0.5 rounded font-bold ${log.metode === 'GET' ? 'bg-red-50 text-[#500000] border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{log.metode}</span>
                                                        <span className="truncate max-w-[200px] md:max-w-md">{log.endpoint}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 md:px-6 text-right whitespace-nowrap">
                                            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1.5 uppercase tracking-wider mb-1">
                                                <Clock size={12} /> {new Date(log.waktu_akses).toLocaleTimeString('id-ID')}
                                            </div>
                                            <div className={`text-sm font-black font-mono ${log.status_code >= 200 && log.status_code < 300 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {log.status_code}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td className="p-10 text-center text-slate-400 font-medium">Belum ada aktivitas API.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};