"use client";
import { useState } from "react";
import Link from "next/link";
import { useDemo } from "./demo-context";
import { Empty, Icon } from "./ui";
import { PageHeading, ReportTable } from "./dashboard";
import { dateLabel, exportCSV, number, percentage, schools } from "@/lib/data";
import { useFeedback } from "@/lib/use-feedback";
export default function History() {
  const { reports } = useDemo(); const [query, setQuery] = useState(""); const [school, setSchool] = useState("Semua sekolah"); const [message, setMessage] = useFeedback();
  const filtered = reports.filter(r => (school === "Semua sekolah" || r.school === school) && [r.menu, r.school, r.id, dateLabel(r.date)].join(" ").toLowerCase().includes(query.toLowerCase())).sort((a,b) => b.date.localeCompare(a.date));
  return <>
    <PageHeading title="Riwayat pengamatan" description="Semua menu, foto, dan cerita yang sudah kamu catat."><Link href="/foto/" className="btn btn-sun"><Icon name="plus" size={18}/>Foto ompreng</Link></PageHeading>
    <section className="panel history-panel"><div className="history-toolbar"><label className="search-input"><Icon name="search" size={19}/><span className="sr-only">Cari menu, sekolah, atau nomor catatan</span><input placeholder="Cari menu, sekolah, atau nomor…" value={query} onChange={e => setQuery(e.target.value)}/></label><div className="filters"><label className="sr-only" htmlFor="history-school">Filter sekolah</label><select id="history-school" value={school} onChange={e => setSchool(e.target.value)}><option>Semua sekolah</option>{schools.map(s => <option key={s}>{s}</option>)}</select><button className="btn btn-outline" disabled={!filtered.length} onClick={() => { exportCSV("TUNTAS-riwayat.csv", [["TUNTAS — DATA SIMULASI"], ["ID", "Tanggal", "Sekolah", "Menu", "Sampel", "Sisa (%)"], ...filtered.map(r => [r.id, r.date, r.school, r.menu, r.samples, number(percentage(r), 2)])]); setMessage("Riwayat sesuai filter berhasil diekspor."); }}><Icon name="download" size={17}/>Ekspor</button></div></div>
      <div className="history-count">{filtered.length} catatan ditemukan</div>{filtered.length ? <ReportTable reports={filtered}/> : <Empty title="Belum ada catatan yang cocok." text="Coba kata kunci lain atau ubah filter sekolah."/>}
    </section><p className="data-disclaimer">Riwayat dan foto pengamatan tersimpan pada browser perangkat ini.</p>{message && <div className="toast" role="status"><Icon name="check" size={18}/>{message}</div>}
  </>;
}
