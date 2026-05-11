/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { api } from "../services/api";

export interface ApiLog {
  id_log: string;
  aktor: string;
  tipe_aktor: 'USER_ADMIN' | 'CLIENT_API' | 'GUEST' | string;
  metode: string;
  endpoint: string;
  status_code: number;
  ip_address: string;
  user_agent: string;
  waktu_akses: string;
}

interface FetchLogParams {
  page?: number;
  limit?: number;
  search?: string;
  tipe_aktor?: string;
  metode?: string;
}

export const useApiLogs = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1, totalItems: 0 });

  const fetchLogs = useCallback(async (params: FetchLogParams = {}) => {
    setIsLoading(true);
    try {
      const response = await api.get("/logs", { params });
      setLogs(response.data.data);
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (err: any) {
      console.error("Gagal mengambil data log:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    logs,
    meta,
    isLoading,
    fetchLogs
  };
};