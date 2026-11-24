"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDemo } from "./demo-context";
import { Empty, FoodIcon, Icon, TrayPhoto } from "./ui";
import { PageHeading } from "./dashboard";
import { dateLabel, exportCSV, leftover, number, percentage } from "@/lib/data";
import { useFeedback } from "@/lib/use-feedback";
import CountUp from "./count-up";

export default function Results() {
  const { reports, ready, updateReport } = useDemo();
  const [id, setId] = useState<string | null>(null); const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false); const [values, setValues] = useState<number[]>([]);
  const [message, setMessage] = useFeedback(); const [savedAt, setSavedAt] = useState(0);
  useEffect(() => { setId(new URLSearchParams(window.location.search).get("id")); setLoaded(true); }, []);
  const report = id ? reports.find(r => r.id === id) : reports[0];
  if (!ready || !loaded) return <div className="loading" role="status">Memuat hasil…</div>;
  if (!report) return <Empty title="Catatan tidak ditemukan." text="Catatan ini mungkin sudah dihapus dari browser. Buka riwayat atau buat catatan baru."/>;
  const r = report;
  const grams = leftover(r);
  function download() {
    exportCSV("TUNTAS-" + r.id + ".csv", [["TUNTAS — DATA SIMULASI"], ["ID", r.id], ["Sekolah", r.school], ["Tanggal", r.date], ["Menu", r.menu], ["Sampel", r.samples], ["Komponen", "Porsi awal (g/ompreng)", "Sisa (%)", "Estimasi sisa sampel (kg)"], ...r.components.map(c => [c.name, c.portion, c.percent, Number((c.portion * c.percent / 100 * r.samples / 1000).toFixed(3))])]);
    setMessage("Hasil pengamatan berhasil diekspor.");
  }
  return <>
    <Link href="/riwayat/" className="text-link result-back"><Icon name="back" size={17}/>Kembali ke riwayat</Link>
    <PageHeading title="Kenali yang tersisa." description={r.school + " · " + dateLabel(r.date)}><button className="btn btn-outline" onClick={download}><Icon name="download" size={18}/>Ekspor hasil</button><Link href="/belanja/" className="btn btn-sun hide-mobile">Susun belanja<Icon name="cart" size={18}/></Link></PageHeading>
    <section className="panel estimate-check sticker-soft" aria-labelledby="estimate-check-title"><div className="estimate-check-list"><h2 id="estimate-check-title">Yang sudah dicatat</h2><ul>
      <li><span className="check-dot"><Icon name="check" size={14}/></span>{r.source === "contoh" ? "Pasangan foto contoh sebelum dan sesudah makan" : "Pasangan foto sebelum dan sesudah dari perangkatmu"}</li>
      <li><span className="check-dot"><Icon name="check" size={14}/></span>Menu, sekolah, dan {r.samples} ompreng sampel dari {r.portions} porsi</li>
      <li><span className="check-dot"><Icon name="check" size={14}/></span>Berat porsi awal untuk {r.components.length} komponen menu</li>
    </ul></div><div className="estimate-limit"><Icon name="info" size={19}/><p><b>Keterbatasan:</b> analisis AI belum terhubung. Persentase sisa awal adalah nilai contoh, bukan hasil membaca foto atau menimbang. Tinjau dan sesuaikan dengan pengamatanmu.</p></div></section>
    <div className="result-layout"><section className="panel result-photos"><div className="panel-heading"><div><h2>{r.menu}</h2><p>{r.id} · {r.samples} ompreng sampel</p></div></div><div className="result-photo-pair"><div><TrayPhoto src={r.before}/><b>Sebelum makan</b></div><div><TrayPhoto src={r.after} after/><b>Sesudah makan</b></div></div><p className="quiet">{r.source === "contoh" ? "Foto sebelum adalah foto asli; foto sesudah merupakan ilustrasi sisa yang dibuat dengan AI." : "Foto dari perangkatmu, disimpan lokal di browser."}</p></section>
    <section className="panel result-summary sticker"><Icon name="bowl" size={30}/><h2>Estimasi sisa sampel</h2><strong><CountUp value={grams * r.samples / 1000} digits={2}/><small>kg</small></strong><p>Dari {r.samples} ompreng yang dicatat</p><div><b>{number(percentage(r))}%</b><span>dari berat porsi awal sampel</span></div><p className="quiet">Perhitungan memakai porsi awal contoh dan estimasi sisa per komponen.</p></section></div>
    <section className="panel results-breakdown"><div className="panel-heading"><div><h2>Sisa per komponen</h2><p>Berat awal: gram per ompreng</p></div><button className="btn btn-outline btn-small" onClick={() => { setEditing(!editing); setValues(r.components.map(c => c.percent)); setMessage(""); }}>{editing ? "Batalkan" : "Tinjau estimasi"}</button></div>
      <div className="table-scroll"><table className="data-table breakdown-table"><thead><tr><th>Komponen menu</th><th>Porsi awal</th><th>Sisa</th><th>Sisa sampel</th><th>Catatan</th></tr></thead><tbody>{r.components.map((c, i) => <tr key={c.name}><td><div className="food-name"><FoodIcon index={i}/><div><b>{c.name}</b><span>{c.food}</span></div></div></td><td>{c.portion} g</td><td>{editing ? <label className="percent-input"><span className="sr-only">Persentase sisa {c.name}</span><input type="number" min="0" max="100" step="1" value={Number.isNaN(values[i]) ? "" : values[i]} onChange={e => setValues(old => old.map((n, index) => index === i ? (e.target.value === "" ? NaN : Number(e.target.value)) : n))}/>%</label> : <b key={savedAt} className={savedAt ? "pop" : undefined}>{number(c.percent)}%</b>}</td><td>{number(c.portion * c.percent / 100 * r.samples / 1000, 2)} kg</td><td><span className={c.percent > 30 ? "pill pill-amber" : "pill pill-green"}>{c.percent > 30 ? "Perlu ditinjau" : "Pantau berkala"}</span></td></tr>)}</tbody></table></div>
      {editing && <div className="edit-actions"><p>Isi estimasi 0–100%. Penyuntingan ini tidak memvalidasi akurasi.</p><button className="btn btn-primary" disabled={values.some(n => !Number.isFinite(n) || n < 0 || n > 100)} onClick={() => { updateReport({ ...r, components: r.components.map((c, i) => ({ ...c, percent: values[i] })) }); setEditing(false); setSavedAt(Date.now()); setMessage("Estimasi diperbarui di browser ini."); }}><Icon name="check" size={17}/>Simpan estimasi</button></div>}
    </section>
    <section className="recommendation"><img src="/brand/porsi.png" alt="" width="125" height="129"/><div><h2>Bahan diskusi untuk tim gizi.</h2><p>{r.components.some(c => c.percent > 30) ? r.components.filter(c => c.percent > 30).map(c => c.name).join(", ") + " memiliki estimasi sisa di atas 30%. Tinjau penerimaan menu, tekstur, cara masak, dan waktu distribusi sebelum menyesuaikan porsi." : "Semua komponen berada di bawah ambang tinjau 30% pada catatan ini. Tetap pantau tren lintas hari sebelum mengambil keputusan."}</p><b>Perubahan porsi tetap perlu persetujuan ahli gizi.</b></div></section>
    <div className="mobile-cta"><Link href="/belanja/" className="btn btn-sun">Susun belanja<Icon name="cart" size={18}/></Link></div>
    {message && <div role="status" className="toast"><Icon name="check" size={18}/>{message}</div>}
  </>;
}
