import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWilayah } from '../../hooks/useWilayah';
import { ArrowLeft, Loader2, History } from 'lucide-react';
import type { WilayahLog } from '../../types/wilayah';

export const WilayahLogPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchWilayahLogs } = useWilayah();
    const [logs, setLogs] = useState<WilayahLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            if (!id) return;
            setIsLoading(true);
            const res = await fetchWilayahLogs(id);
            if (res.success && res.data) {
                setLogs(res.data);
            }
            setIsLoading(false);
        };
        loadLogs();
    }, [id, fetchWilayahLogs]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/wilayah')}
                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <History size={24} className="text-[#500000]" />
                            Audit Trail / Log Wilayah
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Log aktivitas pembaruan dan perubahan status data master wilayah.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 whitespace-nowrap">Waktu Kejadian</th>
                                <th className="p-5 whitespace-nowrap">Aksi / Status</th>
                                <th className="p-5 whitespace-nowrap">User Update</th>
                                <th className="p-5 whitespace-nowrap">Detail (JSON Snapshot)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">
                                        <Loader2 className="animate-spin text-yellow-500 mx-auto mb-2" />
                                        Memuat riwayat...
                                    </td>
                                </tr>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id_log} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5 font-medium text-slate-600">
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider border ${
                                                log.aksi === 'INSERT' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                log.aksi === 'UPDATE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                                {log.aksi}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-800">{log.user_update || 'Sistem'}</div>
                                            <div className="text-[11px] text-slate-500">ID Wilayah: {log.id_wilayah}</div>
                                        </td>
                                        <td className="p-5">
                                            <details className="cursor-pointer group">
                                                <summary className="text-[#500000] font-bold hover:text-[#400000] hover:underline text-xs outline-none">
                                                    Lihat Data (Lama vs Baru)
                                                </summary>
                                                <div className="mt-3 p-4 bg-[#400000] shadow-inner rounded-xl text-[11px] text-yellow-400 overflow-x-auto">
                                                    <pre>{JSON.stringify({ Lama: log.data_lama, Baru: log.data_baru }, null, 2)}</pre>
                                                </div>
                                            </details>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">
                                        Belum ada riwayat perubahan untuk wilayah ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};