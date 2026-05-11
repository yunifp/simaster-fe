/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWilayah } from '../../hooks/useWilayah';
import { useAuthStore } from '../../store/useAuthStore';
import type { Wilayah, WilayahFormData, LevelWilayah } from '../../types/wilayah';
import { 
    Search, Plus, Edit, Trash2, MapPin, ChevronRight, X, 
    AlertTriangle, CheckCircle, Loader2, ListTree, ArrowLeft, History, Database, Lock
} from 'lucide-react';

export const WilayahPage: React.FC = () => {
    const navigate = useNavigate();
    const { 
        wilayahs, versions, meta, isLoading, fetchWilayah, fetchVersions,
        createWilayah, updateWilayah, deleteWilayah 
    } = useWilayah();
    const { hasPermission } = useAuthStore();

    const canCreate = hasPermission('/wilayah', 'CREATE');
    const canUpdate = hasPermission('/wilayah', 'UPDATE');
    const canDelete = hasPermission('/wilayah', 'DELETE');

    type Breadcrumb = { 
        id: string | null; 
        name: string; 
        level: LevelWilayah | null;
        kode_pro?: string;
        kode_kab?: string;
        kode_kec?: string;
    };

    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
        { id: null, name: 'Indonesia (Semua Provinsi)', level: null }
    ]);
    const currentView = breadcrumbs[breadcrumbs.length - 1];

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWilayah, setCurrentWilayah] = useState<Wilayah | null>(null);
    
    const [formData, setFormData] = useState<WilayahFormData>({
        parent_id: null, 
        nama_wilayah: '', 
        level: 'PROV',
        kode_pro: '', 
        kode_kab: '', 
        kode_kec: '', 
        kode_kel: '',
        version_id: null
    });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const activeVersion = versions.find(v => v.is_current);

    const getNextLevel = (currentLevel: LevelWilayah | null): LevelWilayah => {
        if (!currentLevel) return 'PROV';
        if (currentLevel === 'PROV') return 'KAB';
        if (currentLevel === 'KAB') return 'KEC';
        return 'KEL';
    };

    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchWilayah({
                page: currentPage,
                limit,
                search: searchTerm,
                parent_id: currentView.id === null ? 'null' : currentView.id
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, currentView, fetchWilayah]);

    const navigateToSub = (wilayah: Wilayah) => {
        setBreadcrumbs([...breadcrumbs, { 
            id: wilayah.id_wilayah, 
            name: wilayah.nama_wilayah, 
            level: wilayah.level,
            kode_pro: wilayah.kode_pro || undefined,
            kode_kab: wilayah.kode_kab || undefined,
            kode_kec: wilayah.kode_kec || undefined
        }]);
        setCurrentPage(1);
        setSearchTerm('');
    };

    const navigateUp = (index: number) => {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        setCurrentPage(1);
        setSearchTerm('');
    };

    const openModal = (wilayah?: Wilayah) => {
        if (wilayah) {
            setCurrentWilayah(wilayah);
            setFormData({
                parent_id: wilayah.parent_id,
                nama_wilayah: wilayah.nama_wilayah,
                level: wilayah.level,
                kode_pro: wilayah.kode_pro || '',
                kode_kab: wilayah.kode_kab || '',
                kode_kec: wilayah.kode_kec || '',
                kode_kel: wilayah.kode_kel || '',
                version_id: wilayah.version_id
            });
        } else {
            setCurrentWilayah(null);
            const nextLevel = getNextLevel(currentView.level);
            setFormData({
                parent_id: currentView.id,
                nama_wilayah: '',
                level: nextLevel,
                kode_pro: currentView.kode_pro || '',
                kode_kab: currentView.kode_kab || '',
                kode_kec: currentView.kode_kec || '',
                kode_kel: '',
                version_id: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = currentWilayah
            ? await updateWilayah(currentWilayah.id_wilayah, formData)
            : await createWilayah(formData);

        if (result.success) {
            setIsModalOpen(false);
            setSuccessMessage(currentWilayah ? "Data berhasil diperbarui!" : "Data (Draft) berhasil ditambahkan!");
            setIsSuccessModalOpen(true);
            fetchWilayah({ 
                page: currentPage, 
                limit, 
                search: searchTerm, 
                parent_id: currentView.id === null ? 'null' : currentView.id 
            });
        } else {
            alert(result.message || "Gagal menyimpan data wilayah.");
        }
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const result = await deleteWilayah(deleteTargetId);
        if (result.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Data berhasil dinonaktifkan (Archived)!");
            setIsSuccessModalOpen(true);
            fetchWilayah({ 
                page: currentPage, 
                limit, 
                search: searchTerm, 
                parent_id: currentView.id === null ? 'null' : currentView.id 
            });
        } else {
            alert(result.message || "Gagal menonaktifkan data.");
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#500000] text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-[0_10px_30px_rgba(80,0,0,0.15)] gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                        <Database size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold tracking-wide">Data Kewilayahan (Rujukan Nasional)</h2>
                        <p className="text-xs text-red-200/60 mt-1">
                            Versi Aktif: <span className="text-yellow-400 font-bold">{activeVersion?.nomor_versi || 'Memuat...'}</span> (Current)
                        </p>
                    </div>
                </div>
                <button onClick={() => navigate('/wilayah/versions')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                    <History size={16} /> Kelola Rilis Versi
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 flex-wrap">
                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            <button 
                                onClick={() => navigateUp(idx)}
                                className={`hover:text-[#500000] transition-colors ${idx === breadcrumbs.length - 1 ? 'text-[#500000] font-black tracking-wide' : ''}`}
                            >
                                {crumb.name}
                            </button>
                            {idx < breadcrumbs.length - 1 && <ChevronRight size={14} />}
                        </React.Fragment>
                    ))}
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-[#500000] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:bg-[#400000] transition-all font-semibold active:scale-95">
                        <Plus size={18} /> Tambah Data (Draft)
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {breadcrumbs.length > 1 && (
                            <button onClick={() => navigateUp(breadcrumbs.length - 2)} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text" placeholder="Cari wilayah di sini..."
                                value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#500000]/20 focus:border-[#500000] outline-none text-sm transition-all"
                            />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        Total: <span className="font-bold text-slate-800">{meta.totalItems}</span> Data
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 whitespace-nowrap">Kode Full</th>
                                <th className="p-5 whitespace-nowrap">Nama Wilayah</th>
                                <th className="p-5 whitespace-nowrap">Level</th>
                                <th className="p-5 whitespace-nowrap">Status Publikasi</th>
                                <th className="p-5 text-center whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-medium"><Loader2 className="animate-spin text-yellow-500 mx-auto mb-2" />Memuat data...</td></tr>
                            ) : wilayahs.length > 0 ? (
                                wilayahs.map((wil) => (
                                    <tr key={wil.id_wilayah} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5 font-mono text-slate-600 font-medium tracking-wide">
                                            {wil.kode_full}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-slate-800 font-bold">
                                                <MapPin size={16} className="text-[#500000]" />
                                                {wil.nama_wilayah}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">
                                                Versi Rujukan:{' '}
                                                {wil.status === 'PUBLISHED' ? (
                                                    <span className="font-bold text-[#500000]">{activeVersion?.nomor_versi || 'Memuat...'}</span>
                                                ) : wil.status === 'DRAFT' ? (
                                                    <span className="text-amber-600 italic">Belum Masuk Rilis (Draft)</span>
                                                ) : (
                                                    <span className="text-slate-400 italic">Diarsipkan</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[10px] font-bold text-slate-600 border border-slate-200 px-3 py-1 rounded-md bg-slate-100 uppercase tracking-wider">
                                                {wil.level}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider w-max border ${wil.status === 'PUBLISHED' ? 'bg-amber-50 text-amber-700 border-amber-200' : wil.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                    {wil.status}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider w-max border ${wil.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {wil.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-2 items-center">
                                                {wil.level !== 'KEL' && (
                                                    <button onClick={() => navigateToSub(wil)} className="px-3 py-1.5 bg-[#500000]/5 text-[#500000] border border-[#500000]/20 hover:bg-[#500000] hover:text-white rounded-lg transition-all text-[11px] font-bold flex items-center gap-1">
                                                        <ListTree size={14} /> Lihat Sub
                                                    </button>
                                                )}
                                                <button onClick={() => navigate(`/wilayah/${wil.id_wilayah}/log`)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Audit Trail">
                                                    <History size={16} />
                                                </button>
                                                {canUpdate && (
                                                    <button onClick={() => openModal(wil)} className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all" title="Edit Data"><Edit size={16} /></button>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => { setDeleteTargetId(wil.id_wilayah); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Arsipkan"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-medium">Data wilayah tidak ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {meta.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 disabled:opacity-50">Sebelumnya</button>
                        <span className="text-sm font-medium text-slate-600">Halaman {meta.currentPage} dari {meta.totalPages}</span>
                        <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 disabled:opacity-50">Selanjutnya</button>
                    </div>
                )}
            </div>

            {/* Modal Form Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#300000]/80 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 bg-[#500000] text-white flex justify-between items-center border-b border-[#400000]">
                            <h2 className="text-lg font-bold tracking-tight">{currentWilayah ? 'Edit Data Kewilayahan' : 'Tambah Data (Draft) Kewilayahan'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-red-200/60 hover:text-white transition-colors"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-7 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                                    <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                                    <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                                        Data yang baru ditambahkan akan otomatis berstatus <strong>DRAFT</strong>. 
                                        Input kode induk akan otomatis terisi dan terkunci berdasarkan navigasi Anda.
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Nama Wilayah</label>
                                    <input required value={formData.nama_wilayah} onChange={e => setFormData({ ...formData, nama_wilayah: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl mt-1 outline-none focus:border-[#500000] focus:ring-2 focus:ring-[#500000]/10 font-bold text-slate-800" placeholder="Masukkan nama resmi wilayah..." />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tingkat / Level</label>
                                    <select disabled={!currentWilayah} value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value as LevelWilayah })} className="w-full border border-slate-200 p-3 rounded-xl mt-1 outline-none focus:border-[#500000] bg-slate-50 font-bold text-slate-700 cursor-not-allowed">
                                        <option value="PROV">PROVINSI</option>
                                        <option value="KAB">KAB/KOTA</option>
                                        <option value="KEC">KECAMATAN</option>
                                        <option value="KEL">KELURAHAN</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                        Kode Prov (2 Digit) {formData.kode_pro && formData.level !== 'PROV' && <Lock size={10} className="text-[#500000]" />}
                                    </label>
                                    <input maxLength={2} readOnly={!!currentView.kode_pro && formData.level !== 'PROV'} value={formData.kode_pro || ''} onChange={e => setFormData({ ...formData, kode_pro: e.target.value })} className={`w-full border border-slate-200 p-3 rounded-xl mt-1 outline-none focus:border-[#500000] font-mono font-bold ${!!currentView.kode_pro && formData.level !== 'PROV' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} placeholder="00" />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                        Kode Kab/Kota (2 Digit) {(formData.kode_kab && (formData.level === 'KEC' || formData.level === 'KEL')) && <Lock size={10} className="text-[#500000]" />}
                                    </label>
                                    <input maxLength={2} readOnly={!!currentView.kode_kab && (formData.level === 'KEC' || formData.level === 'KEL')} value={formData.kode_kab || ''} onChange={e => setFormData({ ...formData, kode_kab: e.target.value })} className={`w-full border border-slate-200 p-3 rounded-xl mt-1 outline-none focus:border-[#500000] font-mono font-bold ${!!currentView.kode_kab && (formData.level === 'KEC' || formData.level === 'KEL') ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} placeholder="00" />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                        Kode Kec (2 Digit) {(formData.kode_kec && formData.level === 'KEL') && <Lock size={10} className="text-[#500000]" />}
                                    </label>
                                    <input maxLength={2} readOnly={!!currentView.kode_kec && formData.level === 'KEL'} value={formData.kode_kec || ''} onChange={e => setFormData({ ...formData, kode_kec: e.target.value })} className={`w-full border border-slate-200 p-3 rounded-xl mt-1 outline-none focus:border-[#500000] font-mono font-bold ${!!currentView.kode_kec && formData.level === 'KEL' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} placeholder="00" />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Kode Kelurahan (4 Digit)</label>
                                    <input maxLength={4} required={formData.level === 'KEL'} disabled={formData.level !== 'KEL'} value={formData.kode_kel || ''} onChange={e => setFormData({ ...formData, kode_kel: e.target.value })} className={`w-full border border-slate-200 p-3 rounded-xl mt-1 outline-none focus:border-[#500000] font-mono font-bold text-[#500000] ${formData.level !== 'KEL' ? 'bg-slate-50 cursor-not-allowed text-slate-300' : ''}`} placeholder="0000" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                <button type="submit" className="bg-[#500000] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#400000] flex items-center gap-2 text-sm shadow-md transition-all active:scale-95">
                                    <ChevronRight size={16} /> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Archive */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#300000]/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={32} /></div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Arsipkan Wilayah?</h2>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Data akan ditandai tidak aktif dan diarsipkan. Ini akan memengaruhi visibilitas di aplikasi KPU lainnya.</p>
                        </div>
                        <div className="flex border-t border-slate-100">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 transition-colors">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-4 font-bold text-red-600 hover:bg-red-50 border-l border-slate-100 transition-colors">Ya, Arsipkan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Sukses */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#300000]/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center animate-in zoom-in duration-200">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Berhasil!</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="w-full mt-8 bg-[#500000] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#400000] active:scale-95 transition-all">Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
};