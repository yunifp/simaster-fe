import { Database } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="tentang" className="bg-[#0d050a] border-t border-white/5 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center shadow-lg">
                <Database size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-white font-black text-lg"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    SI-MASTER KPU
                  </span>
                </div>
                <p className="text-red-500/60 text-[9px] font-semibold tracking-widest uppercase">
                  Master Data API · Komisi Pemilihan Umum
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Platform pengelolaan dan distribusi data kepemiluan resmi Indonesia.
              Menyediakan API terpusat bagi aplikasi-aplikasi yang membutuhkan
              data pemilu yang akurat dan terverifikasi.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500/70 text-xs font-mono">Sistem Operasional</span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-2">
            <div>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-3">Navigasi</p>
              {['Beranda', 'Layanan API', 'Cara Integrasi', 'Tentang'].map((item) => (
                <a key={item} href="#" className="block text-slate-500 hover:text-red-400 text-sm py-1 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-3">Data API</p>
              {['DPT', 'Dapil', 'Partai', 'Calon', 'Hasil Pemilu'].map((item) => (
                <a key={item} href="#" className="block text-slate-500 hover:text-red-400 text-sm py-1 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-3">Sistem</p>
              {['Login Admin', 'Dashboard', 'Manajemen API Key', 'Dokumentasi'].map((item) => (
                <a key={item} href="#" className="block text-slate-500 hover:text-red-400 text-sm py-1 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-700 text-xs">
            &copy; {new Date().getFullYear()} Komisi Pemilihan Umum Republik Indonesia · SI-MASTER Master Data
          </p>
          <p className="text-slate-800 text-xs font-mono">
            v1.0.0 · REST API · JSON · OpenAPI 3.0
          </p>
        </div>
      </div>
    </footer>
  );
};
