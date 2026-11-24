"use client";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "./demo-context";
import { PageHeading } from "./dashboard";
import { Icon } from "./ui";
import { componentNames, dateLabel, exportCSV, leftover, number, percentage, schools } from "@/lib/data";
import { useFeedback } from "@/lib/use-feedback";
export default function Reports() {
  const { reports, ready, reset } = useDemo(); const [start, setStart] = useState(""); const [end, setEnd] = useState("");
  const rangeSet = useRef(false);
  useEffect(() => {
    // Default to the calendar month of the latest record so new captures are always included.
    if (!ready || rangeSet.current) return;
    rangeSet.current = true;
    const latest = reports.reduce((max, r) => r.date > max ? r.date : max, "");
    const base = latest ? new Date(latest + "T12:00:00") : new Date();
    const y = base.getFullYear(), m = base.getMonth();
    const iso = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
    setStart(iso(new Date(y, m, 1, 12))); setEnd(iso(new Date(y, m + 1, 0, 12)));
  }, [ready, reports]);
  const [school, setSchool] = useState("Semua sekolah"); const [message, setMessage] = useFeedback(); const [confirmReset, setConfirmReset] = useState(false);
  const valid = !!start && !!end && start <= end;
  const rows = valid ? reports.filter(r => r.date >= start && r.date <= end && (school === "Semua sekolah" || r.school === school)) : [];
  const count = rows.reduce((s, r) => s + r.samples, 0); const kg = rows.reduce((s, r) => s + leftover(r) * r.samples / 1000, 0);
  return <>
    <PageHeading title="Laporan sisa pangan" description="Ringkasan pengamatan untuk diskusi dan evaluasi tim dapur."><button className="btn btn-outline" disabled={!rows.length} onClick={() => window.print()}><Icon name="print" size={18}/>Cetak / simpan PDF</button><button className="btn btn-sun" disabled={!rows.length} onClick={() => { exportCSV("TUNTAS-laporan-" + start + ".csv", [["TUNTAS — LAPORAN SIMULASI"], ["Periode", start, end], ["Sekolah", school], ["Tanggal", "Sekolah", "Menu", "Sampel", "Estimasi sisa (kg)", "Rasio sisa (%)"], ...rows.map(r => [r.date, r.school, r.menu, r.samples, (leftover(r) * r.samples / 1000).toFixed(3), percentage(r).toFixed(2)])]); setMessage("Laporan periode terpilih berhasil diekspor."); }}><Icon name="download" size={18}/>Ekspor CSV</button></PageHeading>
    <section className="panel report-filters"><label>Dari tanggal<input type="date" value={start} onChange={e => setStart(e.target.value)}/></label><label>Sampai tanggal<input type="date" value={end} onChange={e => setEnd(e.target.value)}/></label><label>Sekolah<select value={school} onChange={e => setSchool(e.target.value)}><option>Semua sekolah</option>{schools.map(s => <option key={s}>{s}</option>)}</select></label></section>
    {rangeSet.current && !valid && <p className="form-error" role="alert">{start && end ? "Pilih tanggal akhir yang sama dengan atau setelah tanggal awal." : "Isi tanggal awal dan akhir periode laporan."}</p>}
    <section className="panel printable-report"><div className="report-title"><div><img src="/brand/logo.png" alt="TUNTAS" width="170" height="34"/><h2>Ringkasan sisa makanan</h2><p>Dapur Nusantara · {school}</p><p>{valid ? dateLabel(start) + " – " + dateLabel(end) : "Periode belum valid"}</p></div></div>
      <div className="report-totals"><div><span>Catatan pengamatan</span><strong>{rows.length}</strong></div><div><span>Ompreng sampel</span><strong>{number(count, 0)}</strong></div><div><span>Estimasi sisa sampel</span><strong>{number(kg, 2)} <small>kg</small></strong></div></div>
      {rows.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Komponen</th><th>Estimasi sisa sampel</th><th>Rasio sisa tertimbang</th></tr></thead><tbody>{componentNames.map((name, i) => { const waste = rows.reduce((s, r) => s + r.components[i].portion * r.components[i].percent / 100 * r.samples / 1000, 0); const food = rows.reduce((s, r) => s + r.components[i].portion * r.samples / 1000, 0); return <tr key={name}><td><b>{name}</b></td><td>{number(waste, 2)} kg</td><td>{number(food ? waste / food * 100 : 0)}%</td></tr>; })}</tbody></table></div> : <div className="report-empty">Tidak ada pengamatan pada periode ini. Ubah tanggal atau sekolah yang dipilih.</div>}
      <div className="report-notes"><h3>Metode dan batasan</h3><p>Perhitungan menggunakan berat porsi contoh, persentase sisa simulasi, dan jumlah sampel. Angka tidak mewakili pengukuran aktual maupun seluruh porsi distribusi. Foto contoh merupakan ilustrasi.</p><p>Dokumen ini adalah ringkasan demo internal, belum merupakan format pelaporan resmi atau bukti kepatuhan regulasi. Semua rekomendasi porsi perlu ditinjau ahli gizi.</p></div>
    </section>
    <section className="reset-section"><div><h3>Kelola data perangkat</h3><p>Kembalikan enam catatan contoh. Catatan dan foto tambahan di browser ini akan dihapus.</p></div>{confirmReset ? <div className="reset-confirm"><button className="btn btn-outline" onClick={() => setConfirmReset(false)}>Batal</button><button className="btn btn-danger" onClick={() => { reset(); setConfirmReset(false); setMessage("Data perangkat kembali ke kondisi awal."); }}>Ya, mulai ulang</button></div> : <button className="btn btn-outline" onClick={() => setConfirmReset(true)}>Atur ulang data perangkat</button>}</section>
    {message && <div className="toast" role="status"><Icon name="check" size={18}/>{message}</div>}
  </>;
}
