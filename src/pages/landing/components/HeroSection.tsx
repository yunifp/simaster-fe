import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, ShieldCheck, Zap } from 'lucide-react';

// Fake API snippet shown in hero
const codeSnippet = `GET /api/v1/pemilu/dapil
Authorization: Bearer <API_KEY>

{
  "status": "success",
  "data": [
    {
      "id": "DAPIL-JB-01",
      "nama": "Jawa Barat I",
      "provinsi": "Jawa Barat",
      "jumlah_kursi": 7
    },
    ...
  ]
}`;

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#10060a]"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(220,38,38,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.8) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-red-900/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-red-950/10 rounded-full blur-[120px]" />
      </div>

      {/* Ornament rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-900/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] border border-red-900/5 rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

        {/* LEFT — Copy */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-7 animate-[fadeInDown_0.6s_ease_forwards]">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold tracking-[0.15em] uppercase">
              Platform Resmi · Komisi Pemilihan Umum
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6 animate-[fadeInUp_0.7s_ease_0.1s_forwards_both]"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
           Sistem Informasi
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-400">
              MASTED DATA KPU
            </span>
            <br />
            <span className="text-4xl sm:text-5xl text-slate-400 font-light italic">
              satu sumber, banyak layanan
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 animate-[fadeInUp_0.7s_ease_0.2s_forwards_both]">
            SI-MASTER KPU adalah <span className="text-slate-200 font-semibold">pusat data resmi kepemiluan Indonesia</span> — menyediakan API terstandarisasi untuk data DPT, Dapil, Partai, Calon, dan hasil pemilu yang dapat dikonsumsi oleh aplikasi-aplikasi terintegrasi.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start animate-[fadeInUp_0.7s_ease_0.25s_forwards_both]">
            {[
              { icon: ShieldCheck, label: 'Data Resmi & Terverifikasi' },
              { icon: Globe, label: 'REST API Standar OpenAPI' },
              { icon: Zap, label: 'Uptime 99.9%' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Icon size={13} className="text-red-400" />
                <span className="text-slate-300 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start animate-[fadeInUp_0.7s_ease_0.3s_forwards_both]">
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.25)] hover:shadow-[0_0_60px_rgba(220,38,38,0.45)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              Akses Dashboard Admin
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.querySelector('#layanan')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-3.5 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              Lihat Layanan API
            </button>
          </div>
        </div>

        {/* RIGHT — Code Preview */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none animate-[fadeInUp_0.8s_ease_0.4s_forwards_both]">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            {/* Window bar */}
            <div className="flex items-center gap-2 bg-[#1c0d10] px-4 py-3 border-b border-white/8">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
              <span className="ml-3 text-slate-500 text-xs font-mono">SI-MASTER-kpu · API Response</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-mono">200 OK</span>
              </div>
            </div>
            {/* Code */}
            <pre className="bg-[#160810] text-xs sm:text-sm font-mono text-slate-300 p-5 overflow-x-auto leading-relaxed">
              <code>
                {codeSnippet.split('\n').map((line, i) => {
                  // Color highlight
                  if (line.startsWith('GET')) return <span key={i} className="block"><span className="text-green-400 font-bold">GET</span><span className="text-red-300"> /api/v1/pemilu/dapil</span>{'\n'}</span>;
                  if (line.startsWith('Authorization')) return <span key={i} className="block text-slate-500">{line}{'\n'}</span>;
                  if (line.includes('"status"')) return <span key={i} className="block"><span className="text-slate-400">  </span><span className="text-blue-300">"status"</span><span className="text-slate-400">: </span><span className="text-green-300">"success"</span>,{'\n'}</span>;
                  if (line.includes('"id"')) return <span key={i} className="block"><span className="text-slate-500">      </span><span className="text-blue-300">"id"</span><span className="text-slate-400">: </span><span className="text-amber-300">"DAPIL-JB-01"</span>,{'\n'}</span>;
                  if (line.includes('"nama"')) return <span key={i} className="block"><span className="text-slate-500">      </span><span className="text-blue-300">"nama"</span><span className="text-slate-400">: </span><span className="text-amber-300">"Jawa Barat I"</span>,{'\n'}</span>;
                  if (line.includes('"provinsi"')) return <span key={i} className="block"><span className="text-slate-500">      </span><span className="text-blue-300">"provinsi"</span><span className="text-slate-400">: </span><span className="text-amber-300">"Jawa Barat"</span>,{'\n'}</span>;
                  if (line.includes('"jumlah_kursi"')) return <span key={i} className="block"><span className="text-slate-500">      </span><span className="text-blue-300">"jumlah_kursi"</span><span className="text-slate-400">: </span><span className="text-purple-300">7</span>{'\n'}</span>;
                  return <span key={i} className="block text-slate-400">{line}{'\n'}</span>;
                })}
              </code>
            </pre>
          </div>

          {/* Stats below code */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { value: '12+', label: 'Endpoint API' },
              { value: '270+', label: 'Dapil Tercakup' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-3 text-center">
                <div className="text-red-400 font-black text-xl">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d050a] to-transparent pointer-events-none" />
    </section>
  );
};
