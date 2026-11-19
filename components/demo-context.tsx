"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { seedReports, type Report } from "@/lib/data";
const KEY = "tuntas-demo-v1";
type Store = { reports: Report[]; ready: boolean; warning: string; addReport: (r: Report) => void; updateReport: (r: Report) => void; reset: () => void };
const Context = createContext<Store | null>(null);
function validReport(v: unknown): v is Report {
  if (!v || typeof v !== "object") return false;
  const r = v as Report;
  return typeof r.id === "string" && typeof r.school === "string" && typeof r.menu === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
    Number.isFinite(r.samples) && r.samples > 0 && Number.isFinite(r.portions) && r.portions > 0 &&
    Array.isArray(r.components) && r.components.length === 4 && r.components.every(c => typeof c.name === "string" && Number.isFinite(c.portion) && c.portion > 0 && Number.isFinite(c.percent) && c.percent >= 0 && c.percent <= 100);
}
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>(seedReports);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState("");
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const data: unknown = JSON.parse(raw); if (Array.isArray(data) && data.every(validReport)) setReports(data); else setWarning("Data tersimpan tidak dapat dibaca. Contoh awal ditampilkan kembali."); } }
    catch { setWarning("Penyimpanan browser tidak tersedia. Aplikasi tetap bisa dipakai selama halaman terbuka."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(reports)); }
    catch { setWarning("Penyimpanan browser penuh atau dibatasi. Perubahan tetap tersedia selama halaman terbuka, tetapi belum tersimpan setelah ditutup."); }
  }, [reports, ready]);
  return <Context.Provider value={{ reports, ready, warning, addReport: r => setReports(old => [r, ...old]), updateReport: r => setReports(old => old.map(x => x.id === r.id ? r : x)), reset: () => { setReports(seedReports); setWarning(""); } }}>{children}</Context.Provider>;
}
export function useDemo() { const value = useContext(Context); if (!value) throw new Error("DemoProvider required"); return value; }
