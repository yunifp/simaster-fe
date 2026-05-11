/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck, Box } from 'lucide-react';
// Pastikan ganti aset ini dengan logo KPU
import kpuLogo from '../../assets/logo_kpu.png'; 

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const loginStore = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, user } = response.data;
            loginStore.login(token, refreshToken, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Akses ditolak. Periksa kembali kredensial Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] p-4 relative overflow-hidden font-sans">
            
            {/* Background Ornaments (Aksen KPU: Merah & Kuning Tipis) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-900/5 blur-3xl"></div>
                <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-yellow-600/5 blur-3xl"></div>
            </div>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-200 z-10">
                
                {/* Header: KPU Branding (Maroon & Gold) */}
                <div className="p-8 bg-gradient-to-br from-[#800000] to-[#500000] text-white text-center relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Box size={100} />
                    </div>
                    
                    <div className="flex justify-center mb-4 relative z-10">
                        <div className="bg-white p-2 rounded-full shadow-xl">
                            <img src={kpuLogo} alt="Logo KPU" className="w-20 h-20 object-contain" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black tracking-tighter relative z-10">
                        SISTEM INFORMASI <span className="text-yellow-400">MASTER DATA</span>
                    </h1>
                    <p className="text-gray-300 text-[10px] uppercase tracking-[0.2em] font-bold mt-1 relative z-10">
                        Komisi Pemilihan Umum Republik Indonesia
                    </p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 flex items-center gap-3 text-red-800 p-4 rounded-xl text-sm border border-red-100 animate-pulse">
                            <ShieldCheck size={18} className="shrink-0" />
                            <span className="font-bold">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block tracking-widest group-focus-within:text-red-800 transition-colors">
                                Email Petugas
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-800 transition-colors" size={18} />
                                <input
                                    type="email" required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:bg-white focus:border-red-800 focus:ring-4 focus:ring-red-800/5 transition-all font-semibold"
                                    placeholder="admin@kpu.go.id"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block tracking-widest group-focus-within:text-red-800 transition-colors">
                                    Kata Sandi
                                </label>
                                <Link to="/forgot-password" title="Reset Sandi" className="text-[10px] font-black text-red-700 hover:text-red-900 uppercase">
                                    Lupa?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-800 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:bg-white focus:border-red-800 focus:ring-4 focus:ring-red-800/5 transition-all font-semibold"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-red-800"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#800000] hover:bg-[#a00000] text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-70 mt-4 uppercase tracking-widest text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Memverifikasi...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Masuk Sekarang</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        Hak Cipta &copy; {new Date().getFullYear()} Komisi Pemilihan Umum Republik Indonesia
                    </p>
                </div>
            </div>
        </div>
    );
};