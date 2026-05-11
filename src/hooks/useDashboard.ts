import { useState, useCallback } from "react";
import { api } from "../services/api";

export interface DashboardSummary {
  totalWilayah: number;
  activeVersion: string;
  totalApiKeys: number;
  totalLogs: number;
  recentLogs: Array<{
    id_log: string;
    aktor: string;
    tipe_aktor: string;
    metode: string;
    endpoint: string;
    status_code: number;
    waktu_akses: string;
  }>;
}

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalWilayah: 0,
    activeVersion: "-",
    totalApiKeys: 0,
    totalLogs: 0,
    recentLogs: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/dashboard/summary");
      if (res.data.success) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { summary, isLoading, fetchSummary };
};