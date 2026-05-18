/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState, useCallback } from 'react';
import { useWilayah } from '../../hooks/useWilayah';
import type { ApiKey } from '../../hooks/useWilayah'; 
import { 
    Code2, Copy, Check, Lock, FileJson, AlertOctagon, 
    ChevronDown, KeyRound, Plus, PowerOff, Eye, EyeOff, 
    TerminalSquare, Braces, Send, Database, Wand2, Layers,
    CheckCircle2, Flame
} from 'lucide-react';

type SnippetLang = 'CURL' | 'JS' | 'PHP';

export const ApiWilayahStorePage: React.FC = () => {
    const { fetchApiKeys, generateApiKey, revokeApiKey } = useWilayah();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'DOCS' | 'KEYS'>('DOCS');
    const [snippetLang, setSnippetLang] = useState<SnippetLang>('CURL');
    
    // Switcher Tipe Request: Single Object vs Bulk Array
    const [requestMode, setRequestMode] = useState<'SINGLE' | 'BULK'>('SINGLE');

    // API Keys State
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

    // State Hasil Submit Form POST Wilayah
    const [submitStatus, setSubmitStatus] = useState<{
        success: boolean;
        message: string;
        data?: any;
    } | null>(null);

    // =================================================================
    // 🔥 STATE KHUSUS MODAL KONFIRMASI PUTUS KONEKSI (REVOKE) 🔥
    // =================================================================
    const [confirmRevokeKey, setConfirmRevokeKey] = useState<{ id: string; clientName: string } | null>(null);
    const [isRevoking, setIsRevoking] = useState<boolean>(false);

    // State Interactive Swagger / Builder
    const [bLevel, setBLevel] = useState<'PROV' | 'KAB' | 'KEC' | 'KEL'>('KEL');
    const [bNama, setBNama] = useState<string>('PURBALINGGA WETAN');
    const [bSumber, setBSumber] = useState<string>('Aplikasi Sidapil');
    const [bKodePro, setBKodePro] = useState<string>('33');
    const [bKodeKab, setBKodeKab] = useState<string>('03');
    const [bKodeKec, setBKodeKec] = useState<string>('06');
    const [bKodeKel, setBKodeKel] = useState<string>('2001');
    const [bParentId, setBParentId] = useState<string>('');

    const loadApiKeys = useCallback(async () => {
        const keys = await fetchApiKeys();
        setApiKeys(keys);
    }, [fetchApiKeys]);

    useEffect(() => {
        loadApiKeys();
    }, [loadApiKeys]);

    const handleLevelChange = (level: 'PROV' | 'KAB' | 'KEC' | 'KEL') => {
        setBLevel(level);
        if (level === 'PROV') {
            setBNama('JAWA TENGAH');
            setBKodePro('33');
        } else if (level === 'KAB') {
            setBNama('KABUPATEN PURBALINGGA');
            setBKodePro('33');
            setBKodeKab('03');
        } else if (level === 'KEC') {
            setBNama('PURBALINGGA');
            setBKodePro('33');
            setBKodeKab('03');
            setBKodeKec('06');
        } else {
            setBNama('PURBALINGGA WETAN');
            setBKodePro('33');
            setBKodeKab('03');
            setBKodeKec('06');
            setBKodeKel('2001');
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleKeyReveal = (id: string) => setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));

    const maskKey = (key: string) => {
        if (key.length < 15) return key;
        return `${key.substring(0, 12)}••••••••••••••••${key.slice(-4)}`;
    };

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        const res = await generateApiKey(newClientName);
        setIsGenerating(false);
        if (res.success) {
            setNewClientName('');
            setShowKeyModal(false);
            loadApiKeys();
        } else alert(res.message);
    };

    // =================================================================
    // 🔥 EKSEKUSI PEMUTUSAN KONEKSI DARI DALAM MODAL GLOWING 🔥
    // =================================================================
    const executeRevokeConnection = async () => {
        if (!confirmRevokeKey) return;
        setIsRevoking(true);
        const res = await revokeApiKey(confirmRevokeKey.id);
        setIsRevoking(false);

        if (res.success) {
            setConfirmRevokeKey(null);
            loadApiKeys();
            // Tampilkan notifikasi sukses kecil
            setSubmitStatus({
                success: true,
                message: `Koneksi kredensial untuk aplikasi '${confirmRevokeKey.clientName}' berhasil diputus secara permanen.`
            });
        } else {
            alert(res.message);
        }
    };

    const baseUrl = window.location.origin.includes('localhost') 
        ? 'http://localhost:8000/api/wilayah' 
        : 'http://203.210.84.69:8237/be/wilayah';

    const endpointStore = `${baseUrl}/store`;

    const generateDynamicPayload = () => {
        const baseItem: any = {};
        if (bKodePro) baseItem.kode_pro = bKodePro;
        
        if (bLevel === 'KAB' || bLevel === 'KEC' || bLevel === 'KEL') {
            if (bKodeKab) baseItem.kode_kab = bKodeKab;
        }
        if (bLevel === 'KEC' || bLevel === 'KEL') {
            if (bKodeKec) baseItem.kode_kec = bKodeKec;
        }
        if (bLevel === 'KEL') {
            if (bKodeKel) baseItem.kode_kel = bKodeKel;
        }

        baseItem.nama_wilayah = bNama.toUpperCase();
        baseItem.level = bLevel;
        baseItem.parent_id = bParentId || null;
        baseItem.sumber = bSumber || "Aplikasi Eksternal";

        if (requestMode === 'SINGLE') {
            return JSON.stringify(baseItem, null, 2);
        } else {
            const secondItem = { ...baseItem };
            secondItem.nama_wilayah = `${baseItem.nama_wilayah} (ENTITAS 2)`;
            if (bLevel === 'KEL' && secondItem.kode_kel) {
                const currentKelNum = parseInt(secondItem.kode_kel) || 2001;
                secondItem.kode_kel = String(currentKelNum + 1);
            }
            return JSON.stringify([baseItem, secondItem], null, 2);
        }
    };

    const getSnippet = (url: string, lang: SnippetLang, jsonBody: string) => {
        if (lang === 'CURL') return `curl --request POST \\\n  --url '${url}' \\\n  --header 'Content-Type: application/json' \\\n  --header 'X-API-KEY: YOUR_API_KEY_HERE' \\\n  --data '${jsonBody.replace(/\n/g, '\n  ')}'`;
        if (lang === 'JS') return `fetch("${url}", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "X-API-KEY": "YOUR_API_KEY_HERE"\n  },\n  body: JSON.stringify(${jsonBody})\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(err => console.error(err));`;
        if (lang === 'PHP') return `$ch = curl_init();\ncurl_setopt($ch, CURLOPT_URL, '${url}');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${jsonBody.replace(/\n/g, '')}');\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    'Content-Type: application/json',\n    'X-API-KEY: YOUR_API_KEY_HERE'\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\necho $response;`;
        return '';
    };

    const currentDynamicJson = generateDynamicPayload();

    return (
        <div className="space-y-8 pb-10 font-sans">
            {/* HERO SECTION */}
            <div className="bg-gradient-to-br from-[#500000] to-[#300000] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-[#400000]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="p-3.5 bg-yellow-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-md shadow-lg shadow-yellow-500/10">
                                <Database className="text-yellow-400" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-100">API Portal Store (POST)</h1>
                                <p className="text-yellow-400 font-mono text-sm mt-1 tracking-widest uppercase font-bold">Standarisasi & Staging M2M</p>
                            </div>
                        </div>
                        <p className="text-red-100/70 text-[15px] leading-relaxed max-w-2xl font-medium">
                            Pusat integrasi penyimpanan data wilayah terstandarisasi. Mendukung pengiriman <strong className="text-white">Single Object</strong> maupun <strong className="text-white">Bulk Array Massal</strong> secara dinamis pada satu URL endpoint terpusat.
                        </p>
                    </div>
                </div>
            </div>

            {/* TABS NAVIGATION */}
            <div className="flex border-b border-slate-200 bg-white/50 backdrop-blur-sm  top-0 z-30 px-2 pt-2 rounded-t-3xl">
                <button 
                    onClick={() => setActiveTab('DOCS')} 
                    className={`pb-4 px-6 font-bold text-sm transition-all border-b-[3px] flex items-center gap-2 cursor-pointer ${activeTab === 'DOCS' ? 'border-[#500000] text-[#500000] bg-red-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'}`}
                >
                    <Code2 size={18} /> Interactive Swagger (POST)
                </button>
                <button 
                    onClick={() => setActiveTab('KEYS')} 
                    className={`pb-4 px-6 font-bold text-sm transition-all border-b-[3px] flex items-center gap-2 cursor-pointer ${activeTab === 'KEYS' ? 'border-[#500000] text-[#500000] bg-red-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'}`}
                >
                    <KeyRound size={18} /> Credentials (API Keys)
                </button>
            </div>

            {/* ==================================================== */}
            {/* TAB 1: INTERACTIVE SWAGGER DOCS */}
            {/* ==================================================== */}
            {activeTab === 'DOCS' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Security Banner */}
                    <div className="bg-gradient-to-br from-[#500000] to-[#300000] rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[#400000] text-white">
                        <div className="p-6 md:p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 bg-[#400000]/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3 font-bold mb-3 text-lg">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Lock size={20} /></div>
                                Autentikasi M2M
                            </div>
                            <p className="text-sm text-red-100/70 leading-relaxed">
                                Endpoint KPU mensyaratkan token <code className="text-yellow-300 font-mono bg-yellow-500/20 px-1.5 py-0.5 rounded">X-API-KEY</code> pada header. Dapatkan token Anda pada tab Credentials.
                            </p>
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center space-y-4">
                            <div className="bg-[#1a0000] rounded-xl p-5 font-mono text-sm border border-black/20 shadow-inner">
                                <div className="flex gap-4 items-center">
                                    <span className="text-red-300 w-28 shrink-0 font-bold">X-API-KEY:</span>
                                    <span className="text-yellow-400 break-all">&lt;YOUR_API_KEY_HERE&gt;</span>
                                </div>
                                <div className="flex gap-4 items-center mt-3 pt-3 border-t border-white/10">
                                    <span className="text-red-300 w-28 shrink-0 font-bold">Content-Type:</span>
                                    <span className="text-emerald-400">application/json</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifikasi Hasil Form Biasa */}
                    {submitStatus && (
                        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${submitStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <div className="mt-0.5 shrink-0">
                                {submitStatus.success ? <CheckCircle2 className="text-emerald-600" size={20} /> : <AlertOctagon className="text-red-600" size={20} />}
                            </div>
                            <div className="text-xs leading-relaxed overflow-hidden w-full">
                                <p className="font-bold text-sm mb-1">{submitStatus.success ? 'Informasi Status' : 'Pengiriman Gagal'}</p>
                                <p>{submitStatus.message}</p>
                                <button onClick={() => setSubmitStatus(null)} className="mt-2 text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-100 font-bold cursor-pointer">Tutup</button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                        <div className="p-6 md:p-8 border-b bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-yellow-500 text-[#500000] text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">POST REQUEST</span>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Simpan Data Wilayah Eksternal</h3>
                                </div>
                                <p className="text-sm text-slate-600 font-medium">Endpoint untuk menampung dan menstandardisasi data dari aplikasi luar ke tabel staging <code className="bg-slate-200 px-1 rounded font-mono text-xs">mst_wilayah_store</code>.</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-5">
                            {/* Endpoint Block */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 relative">
                                <div className="bg-[#0d1117] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner group">
                                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full">
                                        <span className="bg-amber-500/20 text-amber-400 font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider border border-amber-500/30 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">URL TARGET</span>
                                        <code className="text-[13px] md:text-sm font-mono text-slate-300 whitespace-nowrap select-all">
                                            {endpointStore}
                                        </code>
                                    </div>
                                    <button onClick={() => handleCopy(endpointStore, 'endpoint_post')} className="p-2.5 w-full md:w-auto flex justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-600 shrink-0 cursor-pointer">
                                        {copiedId === 'endpoint_post' ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                                    </button>
                                </div>
                            </div>

                            {/* PANEL SWAGGER BUILDER DENGAN SWITCHER SINGLE / BULK */}
                            <div className="bg-gradient-to-r from-slate-50 to-red-50/30 rounded-2xl p-6 border border-slate-200/80 space-y-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                                    <div>
                                        <h4 className="text-xs font-black text-[#500000] uppercase tracking-widest flex items-center gap-2">
                                            <Wand2 size={16} className="text-yellow-600"/> Interactive Swagger Builder (Atur Payload)
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Ubah mode dan nilai di bawah untuk menyesuaikan format JSON</p>
                                    </div>

                                    {/* SWITCHER MODE SINGLE VS BULK */}
                                    <div className="flex bg-white p-1 rounded-xl border border-slate-300/80 shadow-sm self-stretch sm:self-auto">
                                        <button 
                                            onClick={() => setRequestMode('SINGLE')}
                                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${requestMode === 'SINGLE' ? 'bg-[#500000] text-white shadow-sm' : 'text-slate-600 hover:text-[#500000]'}`}
                                        >
                                            Single Object
                                        </button>
                                        <button 
                                            onClick={() => setRequestMode('BULK')}
                                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${requestMode === 'BULK' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-sm' : 'text-slate-600 hover:text-yellow-600'}`}
                                        >
                                            <Layers size={14} /> Bulk Array Massal
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">1. Target Level <span className="text-red-500">*</span></label>
                                        <select 
                                            value={bLevel} 
                                            onChange={e => handleLevelChange(e.target.value as any)}
                                            className="w-full bg-white border border-slate-300 p-2.5 rounded-xl text-xs font-bold text-[#500000] outline-none focus:border-yellow-500 shadow-sm cursor-pointer"
                                        >
                                            <option value="PROV">PROV (Provinsi Saja)</option>
                                            <option value="KAB">KAB (Kabupaten/Kota Saja)</option>
                                            <option value="KEC">KEC (Kecamatan Saja)</option>
                                            <option value="KEL">KEL (Desa/Kelurahan Lengkap)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Nama Wilayah <span className="text-red-500">*</span></label>
                                        <input 
                                            value={bNama} 
                                            onChange={e => setBNama(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 uppercase outline-none focus:border-[#500000]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Aplikasi Pengirim <span className="text-red-500">*</span></label>
                                        <input 
                                            value={bSumber} 
                                            onChange={e => setBSumber(e.target.value)}
                                            className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#500000]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Kode Prov</label>
                                        <input 
                                            value={bKodePro} 
                                            onChange={e => setBKodePro(e.target.value)}
                                            placeholder="33"
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold text-center text-slate-800 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Kode Kab</label>
                                        <input 
                                            value={bKodeKab} 
                                            onChange={e => setBKodeKab(e.target.value)}
                                            disabled={bLevel === 'PROV'}
                                            placeholder="03"
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold text-center text-slate-800 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Kode Kec</label>
                                        <input 
                                            value={bKodeKec} 
                                            onChange={e => setBKodeKec(e.target.value)}
                                            disabled={bLevel === 'PROV' || bLevel === 'KAB'}
                                            placeholder="06"
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold text-center text-slate-800 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Kode Kel</label>
                                        <input 
                                            value={bKodeKel} 
                                            onChange={e => setBKodeKel(e.target.value)}
                                            disabled={bLevel !== 'KEL'}
                                            placeholder="2001"
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold text-center text-slate-800 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Parent ID (Opsional)</label>
                                        <input 
                                            value={bParentId} 
                                            onChange={e => setBParentId(e.target.value)}
                                            placeholder="null / UUID"
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold text-center text-slate-800 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex justify-between items-center bg-white hover:bg-red-50 text-[#500000] font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl border-2 border-red-100 hover:border-red-300 transition-all mt-4 cursor-pointer">
                                <span className="flex items-center gap-2.5"><FileJson size={18} className="text-yellow-600"/> Referensi Skema & Aturan Field</span>
                                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown size={20} /></div>
                            </button>

                            {isExpanded && (
                                <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500 fade-in border-t border-slate-100 pt-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                                <Send size={14} className="text-amber-500"/> Realtime JSON Body (Mode: <span className="text-[#500000] font-mono">{requestMode}</span>)
                                            </h4>
                                            <button 
                                                onClick={() => handleCopy(currentDynamicJson, 'json_body_sim')}
                                                className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                                            >
                                                {copiedId === 'json_body_sim' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                                Salin JSON
                                            </button>
                                        </div>
                                        <div className="bg-[#0d1117] rounded-2xl p-4 overflow-x-auto border border-slate-700/50 shadow-inner font-mono text-xs max-h-[350px]">
                                            <pre className="text-amber-300 leading-relaxed">
                                                {currentDynamicJson}
                                            </pre>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Braces size={14} className="text-yellow-500"/> Skema Respons Sukses (HTTP 201)</h4>
                                        <div className="bg-[#0d1117] rounded-2xl p-4 overflow-x-auto border border-slate-700/50 shadow-inner font-mono text-[11px]">
                                            {requestMode === 'SINGLE' ? (
                                                <pre className="text-emerald-400 leading-relaxed">
{`{
  "status": "success",
  "message": "Data wilayah dari sumber '${bSumber || "Aplikasi Eksternal"}' berhasil disimpan dengan standar.",
  "data": {
    "id_wilayah": "a1b2c3d4-...",
    "kode_pro": "${formatKodeHelper(bKodePro, 2)}",
    ${bLevel !== 'PROV' ? `"kode_kab": "${formatKodeHelper(bKodeKab, 2)}",` : ''}
    ${bLevel === 'KEC' || bLevel === 'KEL' ? `"kode_kec": "${formatKodeHelper(bKodeKec, 2)}",` : ''}
    ${bLevel === 'KEL' ? `"kode_kel": "${formatKodeHelper(bKodeKel, 4)}",` : ''}
    "kode_full": "${generateKodeFullPreview(bLevel, bKodePro, bKodeKab, bKodeKec, bKodeKel)}",
    "nama_wilayah": "${bNama.toUpperCase()}",
    "level": "${bLevel}",
    "parent_id": ${bParentId ? `"${bParentId}"` : 'null'},
    "sumber": "${bSumber || "Aplikasi Eksternal"}",
    "created_at": "2026-05-11T10:35:00.000Z"
  }
}`}
                                                </pre>
                                            ) : (
                                                <pre className="text-emerald-400 leading-relaxed">
{`{
  "status": "success",
  "message": "Berhasil menyimpan 2 data wilayah secara massal (bulk) dengan standar.",
  "meta": {
    "total_inserted": 2
  }
}`}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <TerminalSquare size={14} className="text-[#500000]" /> Code Snippet Integrasi (Mode: {requestMode})
                                    </h4>
                                    <div className="flex bg-slate-200/80 p-1 rounded-lg">
                                        {(['CURL', 'JS', 'PHP'] as SnippetLang[]).map((lang) => (
                                            <button 
                                                key={lang}
                                                onClick={() => setSnippetLang(lang)}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${snippetLang === lang ? 'bg-white text-[#500000] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                {lang === 'JS' ? 'Fetch API' : lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="bg-[#0d1117] rounded-xl p-4 flex-1 shadow-inner border border-slate-700/50 relative group flex items-start overflow-hidden min-h-[250px]">
                                    <pre className="font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap overflow-y-auto w-full h-full custom-scrollbar pr-12">
{getSnippet(endpointStore, snippetLang, currentDynamicJson).split('\n').map((line, i) => {
    let highlighted = line
        .replace(/'([^']+)'/g, "<span class='text-emerald-300'>'$1'</span>")
        .replace(/"([^"]+)"/g, '<span class="text-emerald-300">"$1"</span>')
        .replace(/(fetch|curl|curl_init|curl_setopt|curl_exec|curl_close|echo|\.then|\.catch|method|headers|body|JSON\.stringify)/g, "<span class='text-blue-400'>$1</span>")
        .replace(/YOUR_API_KEY_HERE/g, "<span class='text-yellow-400 font-bold'>YOUR_API_KEY_HERE</span>");
    return <div key={i} dangerouslySetInnerHTML={{__html: highlighted}} />;
})}
                                    </pre>
                                    <button 
                                        onClick={() => handleCopy(getSnippet(endpointStore, snippetLang, currentDynamicJson), 'snippet_code')} 
                                        className="absolute right-3 top-3 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all shadow-md backdrop-blur-sm border border-slate-600 cursor-pointer"
                                        title="Copy Code Snippet"
                                    >
                                        {copiedId === 'snippet_code' ? <Check size={14} className="text-emerald-400"/> : <Copy size={14}/>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================== */}
            {/* TAB 2: MANAJEMEN API KEY */}
            {/* ==================================================== */}
            {activeTab === 'KEYS' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#500000] to-[#300000] p-8 rounded-3xl shadow-xl text-white">
                        <div>
                            <h2 className="text-2xl font-black mb-1">Manajemen Akses M2M</h2>
                            <p className="text-sm text-red-100/70 font-medium">Buat dan pantau kunci akses rahasia (API Keys) untuk otorisasi pengiriman data.</p>
                        </div>
                        <button onClick={() => setShowKeyModal(true)} className="mt-4 md:mt-0 bg-yellow-500 text-[#500000] px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all active:scale-95 cursor-pointer">
                            <Plus size={20} /> Generate New Key
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                    <tr>
                                        <th className="p-6">Client Identity</th>
                                        <th className="p-6">Secret Token (X-API-KEY)</th>
                                        <th className="p-6 text-center">Status</th>
                                        <th className="p-6">Issue Date</th>
                                        <th className="p-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                                    {apiKeys.length > 0 ? apiKeys.map(key => (
                                        <tr key={key.id_key} className="hover:bg-red-50/30 transition-colors group">
                                            <td className="p-6 font-black text-slate-800">{key.client_name}</td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-slate-900 text-yellow-400 font-mono text-xs px-4 py-2 rounded-xl border border-slate-700 shadow-inner w-64 block truncate select-all transition-all duration-300">
                                                        {revealedKeys[key.id_key] ? key.api_key : maskKey(key.api_key)}
                                                    </code>
                                                    <button onClick={() => toggleKeyReveal(key.id_key)} className="text-slate-400 hover:text-[#500000] p-2 bg-white rounded-lg border border-slate-200 hover:border-red-300 shadow-sm transition-all cursor-pointer" title={revealedKeys[key.id_key] ? "Hide Key" : "Reveal Key"}>
                                                        {revealedKeys[key.id_key] ? <EyeOff size={16}/> : <Eye size={16}/>}
                                                    </button>
                                                    <button onClick={() => handleCopy(key.api_key, key.id_key)} className="text-slate-400 hover:text-[#500000] p-2 bg-white rounded-lg border border-slate-200 hover:border-red-300 shadow-sm transition-all cursor-pointer" title="Copy to Clipboard">
                                                        {copiedId === key.id_key ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                {key.is_active ? (
                                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase border border-emerald-200 shadow-sm">Active</span>
                                                ) : (
                                                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase border border-red-200 shadow-sm">Revoked</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-slate-500 text-xs">
                                                {new Date(key.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>

                                            {/* ================================================================= */}
                                            {/* 🔥 TOMBOL TRIGGER MODAL KONFIRMASI PUTUS KONEKSI (POWER OFF) 🔥 */}
                                            {/* ================================================================= */}
                                            <td className="p-6 text-center">
                                                {key.is_active ? (
                                                    <button 
                                                        onClick={() => setConfirmRevokeKey({ id: key.id_key, clientName: key.client_name })} 
                                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl border border-transparent transition-all opacity-0 group-hover:opacity-100 cursor-pointer" 
                                                        title="Putuskan Koneksi Kredensial (Revoke)"
                                                    >
                                                        <PowerOff size={18} />
                                                    </button>
                                                ): (
                                                    <span className="text-slate-300 text-xs">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={5} className="p-16 text-center text-slate-400 bg-slate-50/50">Tidak ada API Key yang tersimpan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL BUAT API KEY */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-[#500000] to-[#300000] text-white">
                            <h2 className="text-lg font-black flex items-center gap-2"><KeyRound size={20} className="text-yellow-400"/> Generate API Key</h2>
                        </div>
                        <form onSubmit={handleGenerateKey} className="p-7 space-y-5">
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Client Application Name</label>
                                <input 
                                    required autoFocus
                                    value={newClientName} 
                                    onChange={e => setNewClientName(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:bg-white focus:border-[#500000] focus:ring-4 focus:ring-red-900/10 font-bold text-slate-800 text-sm transition-all" 
                                    placeholder="Contoh: Aplikasi Sidapil" 
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowKeyModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors cursor-pointer">Batal</button>
                                <button type="submit" disabled={isGenerating} className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#500000] px-6 py-2.5 rounded-xl font-black hover:from-yellow-400 hover:to-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer">
                                    {isGenerating ? <div className="w-4 h-4 border-2 border-[#500000] border-t-transparent rounded-full animate-spin"></div> : "Generate"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================================================================= */}
            {/* 🔥 MODAL KONFIRMASI REVOKE GLOWING DANGER (MOTIF FLAME) 🔥 */}
            {/* ================================================================= */}
            {confirmRevokeKey && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300">
                    
                    {/* Flame Ambiance Glow di Layar Belakang */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-gradient-to-t from-red-600/30 via-orange-600/10 to-transparent filter blur-[120px] animate-pulse"></div>
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full filter blur-[90px]"></div>
                    </div>

                    {/* Kartu Modal Utama */}
                    <div className="relative w-full max-w-lg rounded-[2rem] border-2 bg-gradient-to-b from-[#300000] via-[#150000] to-black border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.8)] text-white p-8 overflow-hidden transition-all animate-in zoom-in-95 duration-300">
                        
                        {/* Motif Grafis Bara Api / Flame */}
                        <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen overflow-hidden">
                            <div className="absolute -bottom-10 left-1/4 w-32 h-48 bg-orange-500 rounded-full filter blur-xl animate-pulse"></div>
                            <div className="absolute -bottom-12 left-1/2 w-48 h-64 bg-red-600 rounded-full filter blur-2xl animate-pulse delay-75"></div>
                            <div className="absolute -bottom-8 right-1/4 w-32 h-40 bg-yellow-500 rounded-full filter blur-xl animate-pulse delay-150"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/fire.png')] opacity-30"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                            
                            {/* Ikon Header Menyala */}
                            <div className="p-4 rounded-full border bg-gradient-to-t from-red-600 to-orange-500 border-red-400 text-white shadow-[0_0_40px_rgba(249,115,22,1)] animate-bounce">
                                <Flame size={44} className="fill-yellow-300 stroke-red-100 animate-pulse" />
                            </div>

                            {/* Judul Menyala / Mewah */}
                            <h3 className="text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_2px_15px_rgba(239,68,68,1)]">
                                PUTUSKAN KONEKSI KREDENSIAL?
                            </h3>

                            {/* Peringatan Bahaya Eksplisit */}
                            <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-200 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full shadow-inner font-mono">
                                Aplikasi <span className="text-yellow-400 underline font-black">{confirmRevokeKey.clientName}</span> akan langsung terputus dari sistem (Error 401 Unauthorized) dan tidak dapat lagi melakukan Store/POST data secara permanen.
                            </p>

                            {/* Tombol Aksi Konfirmasi */}
                            <div className="flex gap-3 w-full mt-4 pt-2">
                                <button 
                                    onClick={() => setConfirmRevokeKey(null)}
                                    disabled={isRevoking}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={executeRevokeConnection}
                                    disabled={isRevoking}
                                    className="flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-500 hover:via-orange-500 hover:to-yellow-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] border border-orange-400/50 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isRevoking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Ya, Putuskan 🔥"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Format Padding & Preview
function formatKodeHelper(val: string | undefined, length: number): string {
    if (!val) return "0".repeat(length);
    return val.padStart(length, "0");
}

function generateKodeFullPreview(
    level: string, pro: string, kab: string, kec: string, kel: string
): string {
    const p = formatKodeHelper(pro, 2);
    const k = formatKodeHelper(kab, 2);
    const c = formatKodeHelper(kec, 2);
    const l = formatKodeHelper(kel, 4);

    if (level === 'PROV') return `${p}.00.00.0000`;
    if (level === 'KAB') return `${p}.${k}.00.0000`;
    if (level === 'KEC') return `${p}.${k}.${c}.0000`;
    return `${p}.${k}.${c}.${l}`;
}