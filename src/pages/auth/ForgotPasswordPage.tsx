/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, Lock, KeyRound, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import kpuLogo from '../../assets/logo_kpu.png';

export const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengirim OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/verify-otp', { email, otp });
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Kode OTP salah.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError('Konfirmasi password tidak cocok.');
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setStep(4);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] p-4 relative font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10">
                
                {/* Branding Header */}
                <div className="p-8 bg-[#800000] text-white text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-2 rounded-full shadow-lg">
                            <img src={kpuLogo} alt="Logo KPU" className="w-16 h-16 object-contain" />
                        </div>
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-tight">
                        {step === 4 ? "Berhasil Diperbarui" : "Pemulihan Akses"}
                    </h1>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-xs border border-red-100 flex items-center gap-2 font-bold">
                            <ShieldAlert size={16} /> {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <p className="text-xs text-gray-500 font-medium text-center">Masukkan email resmi Anda untuk menerima kode OTP pemulihan.</p>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Terdaftar</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email" required autoFocus
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-800 outline-none font-semibold transition-all"
                                        placeholder="admin@kpu.go.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-red-800 hover:bg-red-900 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 uppercase text-xs tracking-widest">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Kirim OTP'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-1 text-center">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">6 Digit Kode OTP</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text" required autoFocus maxLength={6}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-800 outline-none font-bold text-xl tracking-[0.5em] text-center"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-red-900/20">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Verifikasi OTP'}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"} required
                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-800 outline-none font-semibold"
                                        placeholder="Password Baru"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password" required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-red-800 outline-none font-semibold"
                                        placeholder="Konfirmasi Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-red-800 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Simpan Sandi Baru'}
                            </button>
                        </form>
                    )}

                    {step === 4 && (
                        <div className="text-center py-4 space-y-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Sandi Diperbarui</h3>
                            <Link to="/login" className="w-full inline-block bg-slate-900 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-black transition-all">
                                Kembali ke Login
                            </Link>
                        </div>
                    )}

                    {step < 4 && (
                        <div className="text-center mt-6">
                            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-800 transition-colors">
                                <ArrowLeft size={14} /> Kembali ke Beranda
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};