/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Wilayah, WilayahFormData, WilayahLog, WilayahVersion } from "../types/wilayah";

interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  parent_id?: string | null | 'null';
  is_active?: boolean;
  status?: string;
}

export interface ApiKey {
  id_key: string;
  client_name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

// Interface untuk data tunggal store eksternal
export interface StoreExternalItem {
  kode_pro?: string;
  kode_kab?: string;
  kode_kec?: string;
  kode_kel?: string;
  nama_wilayah: string;
  level: string;
  sumber: string;
  parent_id?: string | null;
}

// Payload bisa berupa satu item atau array massal (bulk)
export type StoreExternalPayload = StoreExternalItem | StoreExternalItem[];

export const useWilayah = () => {
  const [wilayahs, setWilayahs] = useState<Wilayah[]>([]);
  const [versions, setVersions] = useState<WilayahVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1, totalItems: 0 });

  const fetchWilayah = useCallback(async (params: FetchParams = {}) => {
    setIsLoading(true);
    try {
      const response = await api.get("/wilayah", { params });
      setWilayahs(response.data.data);
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWilayahLogs = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/wilayah/${id}/logs`);
      return { success: true, data: response.data.data as WilayahLog[] };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }, []);

  const fetchVersions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/wilayah/versions");
      setVersions(response.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVersion = async (data: { nomor_versi: string; keterangan: string; tgl_berlaku: string }) => {
    try {
      const response = await api.post("/wilayah/versions", data);
      return { success: true, message: response.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.error || err.response?.data?.message || "Gagal merilis versi." };
    }
  };

  const createWilayah = async (data: WilayahFormData) => {
    try {
      await api.post("/wilayah", data);
      return { success: true };
    } catch (err: any) {
      return { 
          success: false, 
          message: err.response?.data?.error || err.response?.data?.message || "Gagal menambah data wilayah." 
      };
    }
  };

  const updateWilayah = async (id: string, data: WilayahFormData) => {
    try {
      await api.put(`/wilayah/${id}`, data);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const deleteWilayah = async (id: string) => {
    try {
      await api.delete(`/wilayah/${id}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  // ==========================================
  // API KEY MANAGEMENT
  // ==========================================
  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await api.get("/wilayah/api-keys");
      return response.data.data as ApiKey[];
    } catch (err: any) {
      console.error(err);
      return [];
    }
  }, []);

  const generateApiKey = async (client_name: string) => {
    try {
      const response = await api.post("/wilayah/api-keys", { client_name });
      return { success: true, message: response.data.message, data: response.data.data };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const revokeApiKey = async (id: string) => {
    try {
      const response = await api.delete(`/wilayah/api-keys/${id}`);
      return { success: true, message: response.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  // =====================================================================
  // STORE EXTERNAL WILAYAH (MENDUKUNG SINGLE & BULK MASSAL)
  // =====================================================================
  const storeExternalWilayah = async (apiKey: string, payload: StoreExternalPayload) => {
    try {
      const response = await api.post("/wilayah/store", payload, {
        headers: {
          "X-API-KEY": apiKey
        }
      });
      return { 
        success: true, 
        message: response.data?.message || "Berhasil menyimpan data.", 
        data: response.data?.data,
        meta: response.data?.meta 
      };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.response?.data?.error || err.message || "Gagal menyimpan data eksternal." 
      };
    }
  };

  return {
    wilayahs,
    versions,
    meta,
    isLoading,
    createWilayah,
    updateWilayah,
    deleteWilayah,
    fetchWilayah,
    fetchWilayahLogs,
    fetchVersions,
    createVersion,
    fetchApiKeys,
    generateApiKey,
    revokeApiKey,
    storeExternalWilayah
  };
};