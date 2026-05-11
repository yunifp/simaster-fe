import { UserPlus, Key, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Daftar Aplikasi',
    desc: 'Admin mendaftarkan aplikasi Anda melalui dashboard SI-MASTER KPU dan mengisi informasi sistem yang akan mengonsumsi data.',
  },
  {
    num: '02',
    icon: Key,
    title: 'Dapatkan API Key',
    desc: 'Setelah diverifikasi, sistem akan menerbitkan API Key unik yang digunakan sebagai credential autentikasi di setiap request.',
  },
  {
    num: '03',
    icon: Code2,
    title: 'Integrasi ke Aplikasi',
    desc: 'Gunakan API Key pada header Authorization. Endpoint tersedia dalam REST API standar dengan response format JSON.',
  },
  {
    num: '04',
    icon: Rocket,
    title: 'Konsumsi Data Resmi',
    desc: 'Aplikasi Anda kini dapat mengakses data kepemiluan resmi yang selalu diperbarui langsung dari sumber KPU.',
  },
];

const codeExample = `// Contoh integrasi — JavaScript / Node.js
const response = await fetch(
  'https://SI-MASTER-kpu.go.id/api/v1/partai',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Accept': 'application/json',
    }
  }
);

const { data } = await response.json();
console.log(data); // → Array of partai politik`;

export const IntegrationSection = () => {
  return (
    <section id="integrasi" className="bg-[#10060a] py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-red-800/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-950/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">Cara Integrasi</p>
          <h2
            className="text-4xl sm:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Mulai Integrasi dalam{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              4 Langkah
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="flex flex-col gap-6">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="flex gap-5 group">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800/30 flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-900/40 transition-all duration-300">
                    <Icon size={22} className="text-red-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 border-2 border-[#10060a] flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">{num}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="rounded-2xl overflow-hidden border border-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 bg-[#1c0d10] px-4 py-3 border-b border-white/6">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              <span className="ml-3 text-slate-600 text-xs font-mono">contoh-integrasi.js</span>
            </div>
            <pre className="bg-[#130810] text-xs sm:text-sm font-mono leading-relaxed p-5 overflow-x-auto">
              <code>
                {codeExample.split('\n').map((line, i) => {
                  if (line.startsWith('//')) return <span key={i} className="block text-slate-600">{line}{'\n'}</span>;
                  if (line.includes('await fetch')) return <span key={i} className="block"><span className="text-blue-400">  const</span><span className="text-slate-300"> response = </span><span className="text-blue-400">await</span><span className="text-yellow-300"> fetch</span><span className="text-slate-300">({'\n'}</span></span>;
                  if (line.includes("'Authorization'")) return <span key={i} className="block"><span className="text-slate-500">      </span><span className="text-blue-300">'Authorization'</span><span className="text-slate-400">: </span><span className="text-green-300">'Bearer YOUR_API_KEY'</span>,{'\n'}</span>;
                  if (line.includes("'Accept'")) return <span key={i} className="block"><span className="text-slate-500">      </span><span className="text-blue-300">'Accept'</span><span className="text-slate-400">: </span><span className="text-green-300">'application/json'</span>,{'\n'}</span>;
                  if (line.includes('const { data }')) return <span key={i} className="block"><span className="text-blue-400">const</span><span className="text-slate-300"> {"{ data }"} = </span><span className="text-blue-400">await</span><span className="text-slate-300"> response.</span><span className="text-yellow-300">json</span><span className="text-slate-300">();{'\n'}</span></span>;
                  if (line.includes('console.log')) return <span key={i} className="block"><span className="text-slate-300">console.</span><span className="text-yellow-300">log</span><span className="text-slate-300">(data); </span><span className="text-slate-600">// → Array of partai politik{'\n'}</span></span>;
                  return <span key={i} className="block text-slate-400">{line}{'\n'}</span>;
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
