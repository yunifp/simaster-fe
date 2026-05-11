import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Menu, X } from 'lucide-react';
import logoKpu from '../../../assets/logo_kpu.png';

export const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Layanan API', href: '#layanan' },
    { label: 'Cara Integrasi', href: '#integrasi' },
    { label: 'Tentang', href: '#tentang' },
  ];

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#10060a]/96 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.6)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group"
        >
            <img src={logoKpu} alt="Logo KPU" className="w-10 h-10 object-contain" />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span
                className="text-white font-black text-lg tracking-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                SI-MASTER
              </span>
              <span className="text-[9px] bg-red-700/80 border border-red-500/40 text-red-100 font-bold px-1.5 py-0.5 rounded tracking-widest">
                KPU
              </span>
            </div>
            <span className="text-red-400/60 text-[9px] font-semibold tracking-[0.2em] uppercase">
              Master Data API
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="px-4 py-2 text-slate-300 hover:text-red-400 text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Login Admin
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-800 text-white text-sm font-bold rounded-xl hover:from-red-500 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-800/30 hover:scale-[1.02] active:scale-95"
          >
            Akses Dashboard
          </button>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#10060a]/98 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="text-left px-4 py-3 text-slate-300 hover:text-red-400 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-3 text-slate-300 text-sm font-semibold text-center border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
            >
              Login Admin
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white text-sm font-bold rounded-xl text-center"
            >
              Akses Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
