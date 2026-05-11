import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWilayah } from '../../hooks/useWilayah';
import { ArrowLeft, History, CheckCircle, Archive, Plus, X, Calendar, DatabaseZap } from 'lucide-react';

export const WilayahVersionPage: React.FC = () => {
    const navigate = useNavigate();
    const { versions, fetchVersions, createVersion } = useWilayah();
    
    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nomor_versi: '',
        tgl_berlaku: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await createVersion(formData);
        setIsSubmitting(false);

        if (res.success) {
            setIsModalOpen(false);
            setFormData({ 
                nomor_versi: '', 
                tgl_berlaku: new Date().toISOString().split('T')[0], 
                keterangan: '' 
            });
            fetchVersions();
        } else {
            alert(res.message);
        }
    };

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
                            Riwayat Versi Master Wilayah
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Daftar versi data rujukan wilayah nasional yang pernah dan sedang digunakan.
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#500000] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:bg-[#400000] transition-all font-semibold active:scale-95"
                >
                    <Plus size={18} /> Rilis Versi Baru
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 whitespace-nowrap">Nomor Versi</th>
                                <th className="p-5 whitespace-nowrap">Tanggal Berlaku</th>
                                <th className="p-5 whitespace-nowrap">Keterangan</th>
                                <th className="p-5 whitespace-nowrap text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {versions.length > 0 ? (
                                versions.map((ver) => (
                                    <tr key={ver.id_version} className={`hover:bg-slate-50 transition-colors ${ver.is_current ? 'bg-amber-50/50' : ''}`}>
                                        <td className="p-5 font-bold text-slate-800">
                                            {ver.nomor_versi}
                                        </td>
                                        <td className="p-5 text-slate-600 font-medium">
                                            {new Date(ver.tgl_berlaku).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="p-5 text-slate-600 max-w-xs truncate">
                                            {ver.keterangan || '-'}
                                        </td>
                                        <td className="p-5 text-center">
                                            {ver.is_current ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded-md uppercase border border-green-200">
                                                    <CheckCircle size={12} /> Aktif / Current
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-500 font-bold text-[10px] rounded-md uppercase border border-slate-200">
                                                    <Archive size={12} /> Arsip / History
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">
                                        Data versi tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL RILIS VERSI BARU */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#300000]/80 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 bg-[#500000] text-white flex justify-between items-center border-b border-[#400000]">
                            <div className="flex items-center gap-2">
                                <History size={20} className="text-yellow-400" />
                                <h2 className="text-lg font-bold tracking-tight">Rilis Versi Rujukan Baru</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-red-200/60 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-7 space-y-5">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                                <DatabaseZap className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                                    Sistem akan melakukan <strong>Snapshotting (Cloning)</strong> seluruh data <em>Live</em> dan memublikasikan semua data <strong>DRAFT</strong> ke dalam versi ini. Proses ini mungkin memakan waktu beberapa detik.
                                </p>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nomor Versi (Maks 20 Karakter)</label>
                                <div className="relative mt-1.5">
                                    <input 
                                        required 
                                        maxLength={20}
                                        value={formData.nomor_versi} 
                                        onChange={e => setFormData({ ...formData, nomor_versi: e.target.value })} 
                                        className="w-full border border-slate-200 p-3.5 rounded-xl outline-none focus:border-[#500000] focus:ring-4 focus:ring-[#500000]/10 font-mono font-bold text-slate-800 placeholder:font-sans placeholder:font-normal" 
                                        placeholder="Contoh: v2026.08.01" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Berlaku</label>
                                <div className="relative mt-1.5">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="date" 
                                        required 
                                        value={formData.tgl_berlaku} 
                                        onChange={e => setFormData({ ...formData, tgl_berlaku: e.target.value })} 
                                        className="w-full border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-[#500000] focus:ring-4 focus:ring-[#500000]/10 font-bold text-slate-700" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Keterangan / Catatan Rilis</label>
                                <textarea 
                                    rows={3} 
                                    value={formData.keterangan} 
                                    onChange={e => setFormData({ ...formData, keterangan: e.target.value })} 
                                    className="w-full border border-slate-200 p-4 rounded-xl mt-1.5 outline-none focus:border-[#500000] focus:ring-4 focus:ring-[#500000]/10 font-medium text-sm text-slate-700 leading-relaxed" 
                                    placeholder="Jelaskan alasan atau cakupan perubahan pada versi ini..."
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-[#500000] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#400000] shadow-lg shadow-[#500000]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Snapshotting...</>
                                    ) : 'Rilis Versi Sekarang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};