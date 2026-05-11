/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useApiLogs } from '../../hooks/useApiLogs';
import { 
    Activity, Search, Filter, Server, ShieldAlert, CheckCircle2, 
    XCircle, Clock, Globe, Laptop, Smartphone, AlertTriangle
} from 'lucide-react';

export const ApiLogPage: React.FC = () => {
    const { logs, meta, isLoading, fetchLogs } = useApiLogs();
    
    // Filter States
    const [search, setSearch] = useState('');
    const [tipeAktor, setTipeAktor] = useState('');
    const [metode, setMetode] = useState('');
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs({ page, limit, search, tipe_aktor: tipeAktor, metode });
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [page, search, tipeAktor, metode, fetchLogs]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    // Fungsi Render Warna Method HTTP (Disesuaikan dengan tema Maroon/Red)
    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-red-50 text-[#500000] border-red-200';
            case 'POST': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'PUT': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Fungsi Render Ikon & Warna Status Code HTTP
    const getStatusInfo = (code: number) => {
        if (code >= 200 && code < 300) return { icon: <CheckCircle2 size={16}/>, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' };
        if (code === 401 || code === 403) return { icon: <ShieldAlert size={16}/>, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' };
        if (code === 404) return { icon: <AlertTriangle size={16}/>, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' };
        if (code >= 429) return { icon: <XCircle size={16}/>, color: 'text-red-600', bg: 'bg-red-50 border-red-100' };
        return { icon: <Activity size={16}/>, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-100' };
    };

    return (
        <div className="space-y-6 pb-10">
            {/* HEADER SECTION (MAROON COMMAND CENTER VIBE) */}
            <div className="bg-gradient-to-br from-[#500000] to-[#300000] rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden border border-[#400000]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-0 right-40 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-yellow-500/20 rounded-2xl border border-yellow-500/30 shadow-inner backdrop-blur-sm">
                            <Activity className="text-yellow-400" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-100">Log Aktivitas Sistem</h1>
                            <p className="text-yellow-400 font-mono text-xs mt-1.5 tracking-widest uppercase font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span> Live Security Audit Trail
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-[#200000]/50 border border-white/10 p-4 rounded-2xl flex items-center gap-6 backdrop-blur-sm shadow-inner">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{meta.totalItems.toLocaleString('id-ID')}</div>
                            <div className="text-[10px] text-red-200/70 uppercase tracking-widest font-bold mt-1">Total Logs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        value={search} onChange={handleSearchChange}
                        placeholder="Cari nama aktor atau endpoint..." 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white outline-none text-sm font-medium transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative w-40">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select value={tipeAktor} onChange={(e) => {setTipeAktor(e.target.value); setPage(1);}} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-yellow-500 text-sm font-bold text-slate-600 cursor-pointer appearance-none">
                            <option value="">Semua Aktor</option>
                            <option value="CLIENT_API">Client API (M2M)</option>
                            <option value="USER_ADMIN">Admin Dashboard</option>
                            <option value="GUEST">Guest / Unknown</option>
                        </select>
                    </div>
                    <select value={metode} onChange={(e) => {setMetode(e.target.value); setPage(1);}} className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-yellow-500 text-sm font-bold text-slate-600 cursor-pointer">
                        <option value="">Metode</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="p-5 whitespace-nowrap">Waktu & IP</th>
                                <th className="p-5 whitespace-nowrap">Identitas Aktor</th>
                                <th className="p-5 whitespace-nowrap">Aktivitas (Endpoint)</th>
                                <th className="p-5 text-center whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-20 text-center text-slate-400"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#500000] rounded-full animate-spin mx-auto mb-3"></div>Memuat log aktivitas...</td></tr>
                            ) : logs.length > 0 ? (
                                logs.map((log) => {
                                    const statusInfo = getStatusInfo(log.status_code);
                                    return (
                                        <tr key={log.id_log} className="hover:bg-red-50/30 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1 text-[13px]">
                                                    <Clock size={14} className="text-[#500000]" />
                                                    {new Date(log.waktu_akses).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                                                    <Globe size={12} /> {log.ip_address}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-black text-slate-800 mb-1.5">{log.aktor}</div>
                                                {log.tipe_aktor === 'CLIENT_API' ? (
                                                    <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-max">
                                                        <Server size={10}/> External API Client
                                                    </span>
                                                ) : log.tipe_aktor === 'USER_ADMIN' ? (
                                                    <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-max">
                                                        <Laptop size={10}/> Admin Internal
                                                    </span>
                                                ) : (
                                                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-max">
                                                        <Smartphone size={10}/> Guest
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getMethodColor(log.metode)}`}>
                                                        {log.metode}
                                                    </span>
                                                    <code className="text-[13px] font-mono text-slate-600 break-all">
                                                        {log.endpoint}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${statusInfo.bg} ${statusInfo.color}`}>
                                                    {statusInfo.icon}
                                                    <span className="font-mono font-black text-sm">{log.status_code}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-medium">Tidak ada log aktivitas yang ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* PAGINATION */}
                {meta.totalPages > 1 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm font-medium text-slate-500">
                            Menampilkan Halaman <strong className="text-slate-800">{meta.currentPage}</strong> dari <strong className="text-slate-800">{meta.totalPages}</strong>
                        </span>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-black text-[#500000] bg-white hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:text-slate-400 disabled:hover:bg-white disabled:hover:border-slate-200 transition-colors">Prev</button>
                            <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-black text-[#500000] bg-white hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:text-slate-400 disabled:hover:bg-white disabled:hover:border-slate-200 transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};