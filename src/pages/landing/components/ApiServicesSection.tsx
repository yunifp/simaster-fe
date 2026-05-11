import { Users, MapPin, Flag, UserCheck, BarChart2, ScrollText, Building2, Hash } from 'lucide-react';

const apis = [
  {
    method: 'GET',
    endpoint: '/api/v1/dpt',
    icon: Users,
    title: 'Data Pemilih Tetap',
    desc: 'Data DPT per TPS, kelurahan, kecamatan, kabupaten/kota, dan provinsi di seluruh Indonesia.',
    color: 'text-blue-400',
    bg: 'from-blue-500/15 to-transparent',
    border: 'border-blue-500/20',
    tag: 'Pemilih',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/dapil',
    icon: MapPin,
    title: 'Daerah Pemilihan',
    desc: 'Data Dapil DPR RI, DPRD Provinsi, dan DPRD Kabupaten/Kota beserta alokasi kursi.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/15 to-transparent',
    border: 'border-emerald-500/20',
    tag: 'Wilayah',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/partai',
    icon: Flag,
    title: 'Partai Politik',
    desc: 'Data partai peserta pemilu beserta nomor urut, logo, visi misi, dan informasi resmi.',
    color: 'text-amber-400',
    bg: 'from-amber-500/15 to-transparent',
    border: 'border-amber-500/20',
    tag: 'Partai',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/calon',
    icon: UserCheck,
    title: 'Data Calon',
    desc: 'Profil calon legislatif dan eksekutif, termasuk riwayat, nomor urut, dan dapil terkait.',
    color: 'text-violet-400',
    bg: 'from-violet-500/15 to-transparent',
    border: 'border-violet-500/20',
    tag: 'Kandidat',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/hasil',
    icon: BarChart2,
    title: 'Hasil Pemilu',
    desc: 'Rekapitulasi hasil perolehan suara dari tingkat TPS hingga nasional secara real-time.',
    color: 'text-red-400',
    bg: 'from-red-500/15 to-transparent',
    border: 'border-red-500/20',
    tag: 'Hasil',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/tps',
    icon: Building2,
    title: 'Data TPS',
    desc: 'Informasi lengkap Tempat Pemungutan Suara termasuk lokasi koordinat dan jumlah pemilih.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/15 to-transparent',
    border: 'border-cyan-500/20',
    tag: 'Lokasi',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/jadwal',
    icon: ScrollText,
    title: 'Jadwal & Tahapan',
    desc: 'Data tahapan pemilu, jadwal kampanye, masa tenang, dan hari pemungutan suara resmi.',
    color: 'text-orange-400',
    bg: 'from-orange-500/15 to-transparent',
    border: 'border-orange-500/20',
    tag: 'Jadwal',
  },
  {
    method: 'GET',
    endpoint: '/api/v1/wilayah',
    icon: Hash,
    title: 'Referensi Wilayah',
    desc: 'Data referensi wilayah administratif Indonesia: provinsi, kabupaten/kota, kecamatan, kelurahan.',
    color: 'text-teal-400',
    bg: 'from-teal-500/15 to-transparent',
    border: 'border-teal-500/20',
    tag: 'Referensi',
  },
];

export const ApiServicesSection = () => {
  return (
    <section id="layanan" className="bg-[#0d050a] py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-red-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Layanan API
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Data Kepemiluan Lengkap
            <br />
            <span className="text-slate-500 font-light italic text-3xl sm:text-4xl">
              tersedia melalui satu endpoint terpadu
            </span>
          </h2>
          <p className="text-slate-400 mt-5 max-w-2xl mx-auto text-base leading-relaxed">
            Semua data pemilu yang Anda butuhkan tersedia dalam format JSON terstandarisasi,
            dilengkapi dokumentasi OpenAPI dan autentikasi berbasis API Key.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {apis.map(({ method, endpoint, icon: Icon, title, desc, color, bg, border, tag }) => (
            <div
              key={endpoint}
              className={`group relative p-5 rounded-2xl bg-gradient-to-br ${bg} border ${border} hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-default overflow-hidden`}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${border} ${color} bg-white/5 tracking-wider uppercase`}>
                  {tag}
                </span>
                <span className="text-[10px] font-mono font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                  {method}
                </span>
              </div>

              {/* Icon */}
              <div className="mb-3">
                <Icon size={22} className={`${color} group-hover:scale-110 transition-transform`} />
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-sm mb-1.5">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">{desc}</p>

              {/* Endpoint */}
              <div className="font-mono text-[10px] text-slate-600 bg-white/3 border border-white/5 rounded-lg px-2.5 py-1.5 truncate">
                {endpoint}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-600 text-sm mt-10">
          Semua endpoint tersedia dalam versi <span className="text-slate-400 font-semibold">v1</span> · Dokumentasi lengkap tersedia setelah login
        </p>
      </div>
    </section>
  );
};
