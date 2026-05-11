export type LevelWilayah = 'PROV' | 'KAB' | 'KEC' | 'KEL';

export type AksiLog = 'INSERT' | 'UPDATE' | 'DELETE';

// Tambahan Status MDM
export type StatusWilayah = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface WilayahVersion {
  id_version: number;
  nomor_versi: string;
  tgl_berlaku: string;
  keterangan: string | null;
  is_current: boolean;
}

export interface Wilayah {
  id_wilayah: string;
  kode_pro: string | null;
  kode_kab: string | null;
  kode_kec: string | null;
  kode_kel: string | null;
  kode_full: string;
  nama_wilayah: string;
  level: LevelWilayah;
  parent_id: string | null;
  is_active: boolean;
  status: StatusWilayah; // <--- Field Baru
  version_id: number | null;
  version?: WilayahVersion | null;
  children?: Wilayah[];
  parent?: Wilayah | null;
}

export interface WilayahLog {
  id_log: string;
  id_wilayah: string;
  aksi: AksiLog;
  user_update: string | null;
  data_lama: any;
  data_baru: any;
  created_at: string;
  wilayah?: {
    nama_wilayah: string;
  };
}

export interface WilayahFormData {
  kode_pro: string | null;
  kode_kab: string | null;
  kode_kec: string | null;
  kode_kel: string | null;
  nama_wilayah: string;
  level: LevelWilayah;
  parent_id: string | null;
  is_active?: boolean;
  status?: StatusWilayah; // <--- Field Baru
  version_id?: number | null;
}