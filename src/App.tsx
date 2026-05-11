import { useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RolePage } from './pages/role/RolePage';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MenuPage } from './pages/menu/MenuPage';
import { PermissionPage } from './pages/permission/PermissionPage';
import { UserPage } from './pages/user/UserPage';
import { useAuthStore } from './store/useAuthStore';
import { SearchX, ArrowLeft } from 'lucide-react';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { LandingPage } from './pages/landing/LandingPage'; 
import { WilayahPage } from './pages/wilayah/WilayahPage';
import { WilayahLogPage } from './pages/wilayah/WilayahLogPage';
import { WilayahVersionPage } from './pages/wilayah/WilayahVersionPage'; // IMPORT HALAMAN VERSI BARU
import { ApiWilayahPage } from './pages/api-portal/ApiWilayahPage';
import { ApiLogPage } from './pages/api-portal/ApiLogPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg p-8 animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex justify-center animate-[bounce_3s_ease-in-out_infinite]">
          <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl shadow-blue-900/10 flex items-center justify-center border-[8px] border-slate-50">
            <SearchX size={56} className="text-blue-600" />
          </div>
        </div>
        <h1 className="text-[120px] sm:text-[150px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-950 to-blue-500 drop-shadow-sm select-none">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-500 mt-4 font-medium leading-relaxed">
          Maaf, rute atau halaman yang Anda tuju mungkin telah dihapus, diubah namanya, atau tidak tersedia untuk sementara waktu.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-7 py-3.5 bg-white text-slate-600 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};


function App() {
  const { user } = useAuthStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const INACTIVITY_LIMIT = 30 * 60 * 1000;

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.replace("/login");
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (user) {
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
    }
  }, [user, handleLogout, INACTIVITY_LIMIT]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    if (user) {
      resetTimer();
      events.forEach(event => window.addEventListener(event, resetTimer));
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, resetTimer]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="roles" element={<RolePage />} />
            <Route path="menus" element={<MenuPage />} />
            <Route path="permissions" element={<PermissionPage />} />
            
            {/* PASTIKAN ROUTE VERSION ADA DI ATAS ROUTE LOG AGAR TIDAK BENTROK */}
            <Route path="wilayah" element={<WilayahPage />} />
            <Route path="wilayah/versions" element={<WilayahVersionPage />} />
            <Route path="wilayah/:id/log" element={<WilayahLogPage />} />
            <Route path="/api/wilayah" element={<ApiWilayahPage />} />
            <Route path="/api/logs" element={<ApiLogPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 