/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useWilayah } from '../../hooks/useWilayah';
import type { ApiKey } from '../../hooks/useWilayah'; 
import { 
    Code2, Server, Copy, Check, Archive, CheckCircle, 
    Lock, FileJson, AlertOctagon, ChevronDown, 
    KeyRound, Plus, PowerOff, List, Wand2, Search, MapPin,
    Eye, EyeOff, TerminalSquare, Braces, Globe, Flame
} from 'lucide-react';

type SnippetLang = 'CURL' | 'JS' | 'PHP';

export const ApiWilayahPage: React.FC = () => {
    const { versions, fetchVersions, isLoading, fetchApiKeys, generateApiKey, revokeApiKey } = useWilayah();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'DOCS' | 'KEYS'>('DOCS');
    
    // API Keys State
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

    // 🔥 State Khusus Modal Konfirmasi Putus Koneksi (Revoke) 🔥
    const [confirmRevokeKey, setConfirmRevokeKey] = useState<{ id: string; clientName: string } | null>(null);
    const [isRevoking, setIsRevoking] = useState<boolean>(false);

    // Builder State
    const [showBuilder, setShowBuilder] = useState(false);
    const [buildVersion, setBuildVersion] = useState('');
    const [bTargetLevel, setBTargetLevel] = useState('');
    const [bKeyword, setBKeyword] = useState('');
    const [bPage, setBPage] = useState<number>(1);
    const [bLimit, setBLimit] = useState<number>(100);
    const [snippetLang, setSnippetLang] = useState<SnippetLang>('JS');
    
    // Builder Autocomplete State
    const [bSearchText, setBSearchText] = useState('');
    const [bResults, setBResults] = useState<any[]>([]);
    const [bSelectedParent, setBSelectedParent] = useState<any | null>(null);
    const [isSearchingParent, setIsSearchingParent] = useState(false);

    const loadApiKeys = useCallback(async () => {
        const keys = await fetchApiKeys();
        setApiKeys(keys);
    }, [fetchApiKeys]);

    useEffect(() => {
        fetchVersions();
        loadApiKeys();
    }, [fetchVersions, loadApiKeys]);

    useEffect(() => {
        if (bSearchText.length < 3) {
            setBResults([]);
            return;
        }
        setIsSearchingParent(true);
        const timer = setTimeout(async () => {
            try {
                const res = await api.get('/wilayah', { params: { search: bSearchText, limit: 5 } });
                setBResults(res.data.data);
            } catch (e) { console.error(e); } 
            finally { setIsSearchingParent(false); }
        }, 500);
        return () => clearTimeout(timer);
    }, [bSearchText]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleExpand = (id: string) => setExpandedCard(expandedCard === id ? null : id);
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

    // 🔥 Eksekusi Pemutusan Koneksi dari dalam Modal Glowing 🔥
    const executeRevokeConnection = async () => {
        if (!confirmRevokeKey) return;
        setIsRevoking(true);
        const res = await revokeApiKey(confirmRevokeKey.id);
        setIsRevoking(false);

        if (res.success) {
            setConfirmRevokeKey(null);
            loadApiKeys();
        } else {
            alert(res.message);
        }
    };

    const openBuilder = (version: string) => {
        setBuildVersion(version); setBTargetLevel(''); setBKeyword('');
        setBPage(1); setBLimit(100); setBSearchText('');
        setBSelectedParent(null); setBResults([]); setShowBuilder(true);
    };

    const selectParentWilayah = (wil: any) => {
        setBSelectedParent(wil); setBSearchText(wil.nama_wilayah); setBResults([]);
        if (wil.level === 'PROV') setBTargetLevel('KAB');
        else if (wil.level === 'KAB') setBTargetLevel('KEC');
        else if (wil.level === 'KEC') setBTargetLevel('KEL');
    };

    const clearParentSelection = () => { setBSelectedParent(null); setBSearchText(''); };

    const baseUrl = window.location.origin.includes('localhost') 
        ? 'http://localhost:8000/api/wilayah' 
        : 'http://203.210.84.69:8237/be/wilayah';

    const generateDynamicUrl = () => {
        const q = new URLSearchParams();
        if (bPage > 1) q.append('page', bPage.toString());
        if (bLimit !== 100) q.append('limit', bLimit.toString());
        if (bTargetLevel) q.append('level', bTargetLevel);
        if (bKeyword) q.append('search', bKeyword);
        if (bSelectedParent) {
            if (bSelectedParent.kode_pro) q.append('kode_pro', bSelectedParent.kode_pro);
            if (bSelectedParent.kode_kab && bSelectedParent.level !== 'PROV') q.append('kode_kab', bSelectedParent.kode_kab);
            if (bSelectedParent.kode_kec && (bSelectedParent.level === 'KEC' || bSelectedParent.level === 'KEL')) q.append('kode_kec', bSelectedParent.kode_kec);
        }
        const qs = q.toString();
        return `${baseUrl}/preview/${buildVersion}/all${qs ? `?${qs}` : ''}`;
    };

    const getSnippet = (url: string, lang: SnippetLang) => {
        if (lang === 'CURL') return `curl --request GET \\\n  --url '${url}' \\\n  --header 'X-API-KEY: YOUR_API_KEY_HERE'`;
        if (lang === 'JS') return `fetch("${url}", {\n  method: "GET",\n  headers: {\n    "X-API-KEY": "YOUR_API_KEY_HERE"\n  }\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(err => console.error(err));`;
        if (lang === 'PHP') return `$ch = curl_init();\ncurl_setopt($ch, CURLOPT_URL, '${url}');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    'X-API-KEY: YOUR_API_KEY_HERE'\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\necho $response;`;
        return '';
    };

    return (
        <div className="space-y-8 pb-10 font-sans">
            {/* HERO SECTION (MAROON & GOLD) */}
            <div className="bg-gradient-to-br from-[#500000] to-[#300000] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-[#400000]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-0 right-60 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="p-3.5 bg-yellow-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-md shadow-lg shadow-yellow-500/10">
                                <Server className="text-yellow-400" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-red-100">API Portal Wilayah</h1>
                                <p className="text-yellow-400 font-mono text-sm mt-1 tracking-widest uppercase font-bold">KPU Master Data Network</p>
                            </div>
                        </div>
                        <p className="text-red-100/70 text-[15px] leading-relaxed max-w-2xl font-medium">
                            Pusat integrasi Data Wilayah KPU. Endpoint dikhususkan untuk komunikasi Server-to-Server (M2M) seperti Sidalih & Sirekap. Dilengkapi dengan Interactive Builder untuk menghasilkan URL endpoint dan snippet kode secara instan.
                        </p>
                    </div>
                </div>
            </div>

            {/* TABS NAVIGATION */}
            <div className="flex border-b border-slate-200 bg-white/50 backdrop-blur-sm top-0 z-30 px-2 pt-2 rounded-t-3xl">
                <button 
                    onClick={() => setActiveTab('DOCS')} 
                    className={`pb-4 px-6 font-bold text-sm transition-all border-b-[3px] flex items-center gap-2 cursor-pointer ${activeTab === 'DOCS' ? 'border-[#500000] text-[#500000] bg-red-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'}`}
                >
                    <Code2 size={18} /> Dokumentasi Endpoint
                </button>
                <button 
                    onClick={() => setActiveTab('KEYS')} 
                    className={`pb-4 px-6 font-bold text-sm transition-all border-b-[3px] flex items-center gap-2 cursor-pointer ${activeTab === 'KEYS' ? 'border-[#500000] text-[#500000] bg-red-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'}`}
                >
                    <KeyRound size={18} /> Credentials (API Keys)
                </button>
            </div>

            {/* ==================================================== */}
            {/* TAB 1: DOKUMENTASI API */}
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
                            <div className="flex gap-3 items-center text-xs font-bold px-4 py-2.5 rounded-lg border border-red-900/50 bg-[#400000]/50 text-red-200">
                                <AlertOctagon size={16} className="text-yellow-400 shrink-0" />
                                Rate Limit: 100 req/menit (HTTP 429). Gunakan parameter limit dengan bijak.
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 pt-6 pb-2">
                        <div className="p-2 bg-red-100 text-[#500000] rounded-lg"><List size={20} /></div>
                        <h2 className="text-2xl font-black text-slate-800">Katalog Endpoint</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-16 text-slate-400"><div className="animate-spin w-10 h-10 border-4 border-[#500000] border-t-transparent rounded-full"></div></div>
                    ) : versions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {versions.map((ver) => {
                                const endpointAll = `${baseUrl}/preview/${ver.nomor_versi}/all`;
                                const endpointDetail = `${baseUrl}/preview/${ver.nomor_versi}/{kode_full}`;
                                const isExpanded = expandedCard === ver.id_version.toString();

                                return (
                                    <div key={ver.id_version} className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 ${ver.is_current ? 'border-2 border-yellow-500 shadow-xl shadow-yellow-900/10' : 'border border-slate-200 shadow-md'}`}>
                                        <div className={`p-6 md:p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${ver.is_current ? 'bg-gradient-to-r from-red-50 to-white' : 'bg-slate-50'}`}>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight font-mono">{ver.nomor_versi}</h3>
                                                    {ver.is_current ? (
                                                        <span className="flex items-center gap-1.5 bg-yellow-500 text-[#500000] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md shadow-yellow-200">
                                                            <CheckCircle size={12} /> Active Release
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                            <Archive size={12} /> Legacy
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 font-medium">{ver.keterangan || 'Tidak ada deskripsi rilis.'}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 space-y-5">
                                            {/* Get All Block */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 relative">
                                                <div className="bg-[#0d1117] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner group">
                                                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full">
                                                        <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider border border-emerald-500/30 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">GET COLLECTION</span>
                                                        <code className="text-[13px] md:text-sm font-mono text-slate-300 whitespace-nowrap select-all">
                                                            {endpointAll}
                                                        </code>
                                                    </div>
                                                    <div className="flex gap-2 w-full md:w-auto shrink-0">
                                                        <button onClick={() => openBuilder(ver.nomor_versi)} className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-[#500000] rounded-lg transition-all shadow-lg shadow-yellow-900/20 font-black text-xs active:scale-95 cursor-pointer">
                                                            <Wand2 size={16} /> Builder
                                                        </button>
                                                        <button onClick={() => handleCopy(endpointAll, `${ver.nomor_versi}_all`)} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-600 cursor-pointer">
                                                            {copiedId === `${ver.nomor_versi}_all` ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Get Detail Block */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 relative">
                                                <div className="bg-[#0d1117] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner group">
                                                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full">
                                                        <span className="bg-blue-500/20 text-blue-400 font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider border border-blue-500/30 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">GET DETAIL (ID)</span>
                                                        <code className="text-[13px] md:text-sm font-mono text-slate-300 whitespace-nowrap select-all">
                                                            {endpointDetail}
                                                        </code>
                                                    </div>
                                                    <button onClick={() => handleCopy(endpointDetail, `${ver.nomor_versi}_detail`)} className="p-2.5 w-full md:w-auto flex justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-600 shrink-0 cursor-pointer">
                                                        {copiedId === `${ver.nomor_versi}_detail` ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
                                                    </button>
                                                </div>
                                            </div>

                                            <button onClick={() => toggleExpand(ver.id_version.toString())} className="w-full flex justify-between items-center bg-white hover:bg-red-50 text-[#500000] font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl border-2 border-red-100 hover:border-red-300 transition-all mt-4 cursor-pointer">
                                                <span className="flex items-center gap-2.5"><FileJson size={18} className="text-yellow-600"/> API Reference (Schema & Props)</span>
                                                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown size={20} /></div>
                                            </button>

                                            {isExpanded && (
                                                <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500 fade-in border-t border-slate-100 pt-6">
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Lock size={14} className="text-emerald-500"/> Params URL (Collection)</h4>
                                                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-1">
                                                                <table className="w-full text-left text-xs">
                                                                    <tbody className="divide-y divide-slate-200/60">
                                                                        <tr className="hover:bg-white transition-colors">
                                                                            <td className="p-3 w-1/3"><code className="text-[#500000] font-bold bg-red-100/50 px-2 py-1 rounded">level</code></td>
                                                                            <td className="p-3 text-slate-600 font-medium">Filter hirarki (PROV, KAB, KEC, KEL)</td>
                                                                        </tr>
                                                                        <tr className="hover:bg-white transition-colors">
                                                                            <td className="p-3"><code className="text-[#500000] font-bold bg-red-100/50 px-2 py-1 rounded">kode_pro</code></td>
                                                                            <td className="p-3 text-slate-600 font-medium">2 digit awalan Provinsi</td>
                                                                        </tr>
                                                                        <tr className="hover:bg-white transition-colors">
                                                                            <td className="p-3"><code className="text-[#500000] font-bold bg-red-100/50 px-2 py-1 rounded">kode_kab</code></td>
                                                                            <td className="p-3 text-slate-600 font-medium">2 digit lanjutan Kabupaten</td>
                                                                        </tr>
                                                                        <tr className="hover:bg-white transition-colors">
                                                                            <td className="p-3"><code className="text-[#500000] font-bold bg-red-100/50 px-2 py-1 rounded">search</code></td>
                                                                            <td className="p-3 text-slate-600 font-medium">Pencarian substring nama wilayah</td>
                                                                        </tr>
                                                                        <tr className="hover:bg-white transition-colors">
                                                                            <td className="p-3"><code className="text-[#500000] font-bold bg-yellow-100/50 px-2 py-1 rounded">limit</code></td>
                                                                            <td className="p-3 text-slate-600 font-medium">Pagination size (Default/Max: 100)</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Braces size={14} className="text-yellow-500"/> Output Schema (JSON)</h4>
                                                        <div className="bg-[#0d1117] rounded-2xl p-5 overflow-x-auto border border-slate-700/50 shadow-inner">
                                                            <pre className="text-[11px] md:text-xs font-mono leading-relaxed">
<span className="text-slate-500">{`{`}</span>
  <span className="text-blue-300">"status"</span><span className="text-slate-400">: </span><span className="text-emerald-300">"success"</span><span className="text-slate-400">,</span>
  <span className="text-slate-500">{`  // Block Meta hanya ada di Endpoint Collection`}</span>
  <span className="text-blue-300">"meta"</span><span className="text-slate-400">: {`{`}</span>
    <span className="text-blue-300">"total_data"</span><span className="text-slate-400">: </span><span className="text-yellow-400">120</span><span className="text-slate-400">,</span>
    <span className="text-blue-300">"current_page"</span><span className="text-slate-400">: </span><span className="text-yellow-400">1</span>
  <span className="text-slate-400">{`}`}</span>
  <span className="text-blue-300">"data"</span><span className="text-slate-400">: [</span>
    <span className="text-slate-400">{`{`}</span>
      <span className="text-blue-300">"kode_full"</span><span className="text-slate-400">: </span><span className="text-emerald-300">"33.02.10.2001"</span><span className="text-slate-400">,</span>
      <span className="text-blue-300">"nama_wilayah"</span><span className="text-slate-400">: </span><span className="text-emerald-300">"DESA KARANGANYAR"</span><span className="text-slate-400">,</span>
      <span className="text-blue-300">"level"</span><span className="text-slate-400">: </span><span className="text-emerald-300">"KEL"</span><span className="text-slate-400">,</span>
      <span className="text-blue-300">"is_active"</span><span className="text-slate-400">: </span><span className="text-purple-400">true</span>
    <span className="text-slate-400">{`}`}</span>
  <span className="text-slate-400">]</span>
<span className="text-slate-500">{`}`}</span>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center p-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                            <Archive className="mx-auto text-slate-300 mb-4" size={56} />
                            <h3 className="text-xl font-bold text-slate-700">Tidak Ada Rilis Aktif</h3>
                            <p className="text-slate-500 mt-2 text-sm">Gunakan fitur Snapshot/Rilis Versi di Master Wilayah untuk mengaktifkan API.</p>
                        </div>
                    )}
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
                            <p className="text-sm text-red-100/70 font-medium">Buat dan pantau kunci akses rahasia (API Keys) untuk aplikasi eksternal KPU.</p>
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
                                <tbody className="divide-y divide-slate-100 text-sm">
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
                                            <td className="p-6 text-slate-500 text-xs font-medium">
                                                {new Date(key.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>

                                            {/* 🔥 Tombol Pemicu Modal Konfirmasi Berapi 🔥 */}
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
                                        <tr><td colSpan={5} className="p-16 text-center text-slate-400 font-medium bg-slate-50/50">Tidak ada API Key yang tersimpan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================== */}
            {/* MODAL: INTERACTIVE URL BUILDER & SNIPPET GENERATOR */}
            {/* ==================================================== */}
            {showBuilder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
                        {/* Header */}
                        <div className="px-8 py-5 bg-gradient-to-r from-[#500000] to-[#300000] text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                    <Wand2 size={24} className="text-yellow-400"/>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">API Request Builder</h2>
                                    <p className="text-xs text-red-200 font-mono mt-0.5 tracking-wider">TARGET: {buildVersion}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowBuilder(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#300000] text-red-200 hover:text-white transition-colors border border-transparent hover:border-red-900 cursor-pointer">
                                <PowerOff size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                            {/* Kiri: Form Panel Controls */}
                            <div className="lg:w-[45%] p-8 bg-slate-50/50 space-y-6">
                                <div className="mb-2">
                                    <h3 className="text-sm font-black text-[#500000] uppercase tracking-widest flex items-center gap-2">
                                        <Code2 size={16} className="text-yellow-600" /> Filter Parameter
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1">Rakitan parameter akan mengubah URL seketika.</p>
                                </div>

                                {/* Smart Search Wilayah */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative z-20">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <Search size={14} className="text-[#500000]"/> Induk Referensi
                                    </label>
                                    <div className="relative">
                                        <input 
                                            value={bSearchText}
                                            onChange={(e) => { setBSearchText(e.target.value); if(bSelectedParent) clearParentSelection(); }}
                                            placeholder="Ketik Kab/Kec (misal: Bandung)..."
                                            className={`w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 font-bold text-slate-700 text-sm transition-all ${bSelectedParent ? 'bg-red-50/50 border-red-200 text-[#500000]' : ''}`}
                                        />
                                        {isSearchingParent && (
                                            <div className="absolute right-4 top-3.5"><div className="w-5 h-5 border-[3px] border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div></div>
                                        )}
                                        {bResults.length > 0 && !bSelectedParent && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                                                {bResults.map(res => (
                                                    <button key={res.id_wilayah} onClick={() => selectParentWilayah(res)} className="w-full text-left px-5 py-3 hover:bg-red-50/50 border-b border-slate-100 last:border-0 flex items-center gap-3 transition-colors cursor-pointer">
                                                        <MapPin size={18} className="text-[#500000] shrink-0" />
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">{res.nama_wilayah}</div>
                                                            <div className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">{res.kode_full} • {res.level}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {bSelectedParent && (
                                            <button onClick={clearParentSelection} className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><PowerOff size={16}/></button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 z-10 relative">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Level Data</label>
                                        <select value={bTargetLevel} onChange={e => setBTargetLevel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 text-slate-700 font-bold text-sm cursor-pointer">
                                            <option value="">Semua Level</option>
                                            <option value="PROV">Provinsi</option>
                                            <option value="KAB">Kabupaten/Kota</option>
                                            <option value="KEC">Kecamatan</option>
                                            <option value="KEL">Desa/Kelurahan</option>
                                        </select>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Keyword Pencarian</label>
                                        <input value={bKeyword} onChange={e => setBKeyword(e.target.value)} placeholder="Opsional..." className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-yellow-500 font-bold text-slate-700 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 z-10 relative">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Halaman</label>
                                        <input type="number" min="1" value={bPage} onChange={e => setBPage(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 font-mono font-bold text-sm" />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Limit Data</label>
                                        <input type="number" min="1" max="500" value={bLimit} onChange={e => setBLimit(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 font-mono font-bold text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Kanan: Result & Code Generator Panel */}
                            <div className="lg:w-[55%] flex flex-col bg-slate-50">
                                {/* Result URL */}
                                <div className="p-8 border-b border-slate-200 bg-white">
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Globe size={16} className="text-yellow-500" /> Hasil Endpoint URL
                                    </h3>
                                    <div className="bg-[#0d1117] rounded-2xl p-4 flex shadow-inner border border-slate-700/50 relative group">
                                        <p className="font-mono text-sm leading-relaxed text-emerald-400 break-all w-full pr-12 pt-1 pb-1">
                                            {generateDynamicUrl()}
                                        </p>
                                        <button 
                                            onClick={() => handleCopy(generateDynamicUrl(), 'builder')} 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all shadow-md backdrop-blur-sm border border-slate-600 cursor-pointer"
                                            title="Copy URL"
                                        >
                                            {copiedId === 'builder' ? <Check size={18} className="text-emerald-400"/> : <Copy size={18}/>}
                                        </button>
                                    </div>
                                </div>

                                {/* Code Snippet Generator */}
                                <div className="p-8 flex-1 flex flex-col bg-slate-50">
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                            <TerminalSquare size={16} className="text-[#500000]" /> Code Snippet Generator
                                        </h3>
                                        {/* Language Switcher */}
                                        <div className="flex bg-slate-200/60 p-1 rounded-xl">
                                            {(['JS', 'CURL', 'PHP'] as SnippetLang[]).map((lang) => (
                                                <button 
                                                    key={lang}
                                                    onClick={() => setSnippetLang(lang)}
                                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${snippetLang === lang ? 'bg-white text-[#500000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                >
                                                    {lang === 'JS' ? 'Fetch API' : lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#0d1117] rounded-2xl p-5 flex-1 shadow-inner border border-slate-700/50 relative group flex items-start overflow-hidden">
                                        <pre className="font-mono text-[11px] md:text-[13px] leading-relaxed text-slate-300 whitespace-pre-wrap overflow-y-auto w-full h-full custom-scrollbar pr-12">
{getSnippet(generateDynamicUrl(), snippetLang).split('\n').map((line, i) => {
    // 🔥 PERBAIKAN PREFER-CONST DI SINI 🔥
    const highlighted = line
        .replace(/'([^']+)'/g, "<span class='text-emerald-300'>'$1'</span>")
        .replace(/"([^"]+)"/g, '<span class="text-emerald-300">"$1"</span>')
        .replace(/(fetch|curl|curl_init|curl_setopt|curl_exec|curl_close|echo|\.then|\.catch|method|headers|console\.log|console\.error)/g, "<span class='text-blue-400'>$1</span>")
        .replace(/YOUR_API_KEY_HERE/g, "<span class='text-yellow-400 font-bold'>YOUR_API_KEY_HERE</span>");
    return <div key={i} dangerouslySetInnerHTML={{__html: highlighted}} />;
})}
                                        </pre>
                                        <button 
                                            onClick={() => handleCopy(getSnippet(generateDynamicUrl(), snippetLang), 'snippet')} 
                                            className="absolute right-4 top-4 p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all shadow-md backdrop-blur-sm border border-slate-600 cursor-pointer"
                                            title="Copy Code"
                                        >
                                            {copiedId === 'snippet' ? <Check size={18} className="text-emerald-400"/> : <Copy size={18}/>}
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                    placeholder="Contoh: Sidalih Server 1" 
                                />
                                <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed">Sistem akan meng-generate token rahasia 32-byte unik untuk aplikasi ini.</p>
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
                                Aplikasi <span className="text-yellow-400 underline font-black">{confirmRevokeKey.clientName}</span> akan langsung terputus dari sistem (Error 401 Unauthorized) dan tidak dapat lagi melakukan pembacaan (GET) data secara permanen.
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