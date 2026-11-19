"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemo } from "./demo-context";
import { Empty, FoodIcon, Icon } from "./ui";
import { dateLabel, leftover, number, percentage, schools, type Report } from "@/lib/data";

export function PageHeading({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{children && <div className="page-actions">{children}</div>}</div>;
}
export function ReportTable({ reports }: { reports: Report[] }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Tanggal & menu</th><th>Sekolah</th><th>Sampel</th><th>Estimasi sisa</th><th aria-label="Detail"/></tr></thead><tbody>{reports.map(r => <tr key={r.id}><td><b>{dateLabel(r.date)}</b><span>{r.menu}</span></td><td>{r.school}</td><td>{r.samples} ompreng</td><td><span className={percentage(r) > 20 ? "pill pill-amber" : "pill pill-green"}>{number(percentage(r))}%</span></td><td><Link href={"/hasil/?id=" + encodeURIComponent(r.id)} className="table-action" aria-label={"Lihat hasil " + r.id}>Lihat<Icon name="chevron" size={16}/></Link></td></tr>)}</tbody></table></div>;
}
export default function Dashboard() {
  const { reports } = useDemo();
  const [school, setSchool] = useState("Semua sekolah");
  const [period, setPeriod] = useState("7");
  const data = useMemo(() => {
    const latest = Math.max(...reports.map(r => new Date(r.date).getTime()), 0);
    return reports.filter(r => (school === "Semua sekolah" || school === r.school) && (period === "all" || new Date(r.date).getTime() >= latest - 6 * 86400000));
  }, [reports, school, period]);
  const samples = data.reduce((s, r) => s + r.samples, 0);
  const waste = data.reduce((s, r) => s + leftover(r) * r.samples / 1000, 0);
  const totalFood = data.reduce((s, r) => s + r.components.reduce((a, c) => a + c.portion, 0) * r.samples / 1000, 0);
  const mean = data.length ? [0, 1, 2, 3].map(i => data.reduce((s, r) => s + r.components[i].percent * r.samples, 0) / samples) : [0, 0, 0, 0];
  const trend = [...new Set(data.map(r => r.date))].sort().map(date => {
    const day = data.filter(r => r.date === date);
    return { date, value: day.reduce((s, r) => s + percentage(r) * r.samples, 0) / day.reduce((s, r) => s + r.samples, 0) };
  });
  return <>
    <PageHeading title="Selamat datang di dapur." description="Kenali sisa makanan, rencanakan langkah berikutnya."><Link className="btn btn-sun" href="/foto/"><Icon name="plus" size={19}/>Foto ompreng</Link></PageHeading>
    <section className="dashboard-welcome"><div><h2>Setiap ompreng<br/>punya cerita.</h2><p>Mulai dari satu foto. Cari tahu komponen yang sering tersisa dan bahas perbaikannya bersama tim gizi.</p><Link href="/foto/" className="text-link">Catat menu hari ini<Icon name="chevron" size={17}/></Link></div><img src="/brand/porsi.png" alt="Porsi menyapa petugas dapur" width="230" height="237"/><div className="welcome-tip"><Icon name="leaf" size={27}/><b>Mulai dari sampel.</b><p>Foto sebelum dan sesudah, dengan sudut serta pencahayaan yang sama.</p></div></section>
    <div className="filter-row"><h2>Ringkasan dapur</h2><div className="filters"><label className="sr-only" htmlFor="school-filter">Filter sekolah</label><select id="school-filter" value={school} onChange={e => setSchool(e.target.value)}><option>Semua sekolah</option>{schools.map(s => <option key={s}>{s}</option>)}</select><label className="sr-only" htmlFor="period-filter">Periode ringkasan</label><select id="period-filter" value={period} onChange={e => setPeriod(e.target.value)}><option value="7">7 hari data terakhir</option><option value="all">Semua data</option></select></div></div>
    <div className="stats-grid">
      {[{ label: "Ompreng diamati", value: number(samples, 0), unit: "sampel", icon: "camera", note: "Dari " + data.length + " catatan menu" }, { label: "Estimasi sisa sampel", value: number(waste, 2), unit: "kg", icon: "bowl", note: "Total pada ompreng yang diamati" }, { label: "Rasio sisa sampel", value: number(totalFood ? waste / totalFood * 100 : 0), unit: "%", icon: "chart", note: "Terhadap berat porsi sampel" }, { label: "Sekolah terpantau", value: String(new Set(data.map(r => r.school)).size), unit: "sekolah", icon: "home", note: "Pada periode yang dipilih" }].map((s, i) => <article className="stat" key={s.label}><div><span>{s.label}</span><span className={"stat-icon stat-icon-" + i}><Icon name={s.icon} size={20}/></span></div><strong>{s.value}<small>{s.unit}</small></strong><p>{s.note}</p></article>)}
    </div>
    {!data.length ? <Empty title="Belum ada catatan pada pilihan ini." text="Ubah filter atau tambahkan foto ompreng untuk memulai."/> : <>
      <div className="dashboard-charts"><section className="panel trend-panel"><div className="panel-heading"><div><h2>Tren sisa makanan</h2><p>Rasio sisa pada sampel tiap hari</p></div></div><div className="chart" role="img" aria-label={"Tren sisa makanan: " + trend.map(t => dateLabel(t.date) + " " + number(t.value) + "%").join(", ")}><div className="chart-axis"><span>50%</span><span>25%</span><span>0%</span></div><div className="chart-bars">{trend.map((t, i) => <div className="chart-column" key={t.date}><b>{number(t.value)}%</b><div className={"chart-bar " + (i === trend.length - 1 ? "latest" : "")} style={{ height: Math.max(2, t.value / 50 * 150) }}/><span>{new Date(t.date + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span></div>)}</div></div></section>
      <section className="panel component-panel"><div className="panel-heading"><div><h2>Yang sering tersisa</h2><p>Rata-rata tertimbang jumlah sampel</p></div></div>{mean.map((value, i) => <div className="component-row" key={i}><FoodIcon index={i}/><div><b>{["Karbohidrat", "Lauk", "Sayur", "Buah"][i]}</b><div className="meter"><i style={{ width: value + "%", background: value > 30 ? "var(--amber)" : "var(--leaf)" }}/></div></div><strong>{number(value)}%</strong></div>)}<div className="inline-note"><Icon name="info" size={17}/>Sisa di atas 30% ditandai untuk evaluasi menu.</div></section></div>
      <section className="panel recent-panel"><div className="panel-heading"><div><h2>Catatan terbaru</h2><p>Foto dan hasil yang sudah masuk</p></div><Link href="/riwayat/" className="text-link">Semua riwayat<Icon name="chevron" size={17}/></Link></div><ReportTable reports={[...data].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 4)}/></section>
    </>}
    <p className="data-disclaimer">Estimasi sisa sampel dihitung dari persentase sisa, berat porsi, dan jumlah ompreng yang diamati.</p>
  </>;
}
