"use client";
import { useMemo, useState } from "react";
import { PageHeading } from "./dashboard";
import { FoodIcon, Icon } from "./ui";
import { useDemo } from "./demo-context";
import { exportCSV, number, rupiah } from "@/lib/data";
import { useFeedback } from "@/lib/use-feedback";
const initial = [
  { name: "Beras", portion: 65, stock: 10, price: 14500 },
  { name: "Ayam", portion: 90, stock: 5, price: 38000 },
  { name: "Sayur campur", portion: 100, stock: 8, price: 14000 },
  { name: "Semangka", portion: 100, stock: 12, price: 9000 },
];
export default function Shopping() {
  const { reports } = useDemo();
  const [portions, setPortions] = useState(1000); const [buffer, setBuffer] = useState(5); const [items, setItems] = useState(initial); const [message, setMessage] = useFeedback();
  const valid = portions >= 1 && portions <= 10000 && Number.isInteger(portions) && buffer >= 0 && buffer <= 30 && items.every(x => x.portion >= 1 && x.portion <= 1000 && x.stock >= 0 && x.stock <= 100000 && x.price >= 0 && Number.isFinite(x.price) && Number.isFinite(x.stock));
  const computed = useMemo(() => items.map(item => { const required = portions * item.portion / 1000 * (1 + buffer / 100); const buy = Math.max(0, required - item.stock); return { ...item, required, buy, subtotal: buy * item.price }; }), [items, portions, buffer]);
  const total = computed.reduce((s, x) => s + x.subtotal, 0);
  const meanVeg = reports.length ? reports.reduce((s, r) => s + r.components[2].percent, 0) / reports.length : 0;
  function edit(index: number, key: "portion" | "stock" | "price", value: string) { setItems(old => old.map((x, i) => i === index ? { ...x, [key]: value === "" ? NaN : Number(value) } : x)); }
  return <>
    <PageHeading title="Rencana belanja" description="Dari kebutuhan menu menjadi daftar bahan yang bisa ditindaklanjuti."><button className="btn btn-sun" disabled={!valid} onClick={() => { exportCSV("TUNTAS-rencana-belanja.csv", [["TUNTAS — RENCANA BELANJA SIMULASI"], ["Porsi", portions], ["Cadangan (%)", buffer], ["Bahan", "Bahan mentah per porsi (g)", "Kebutuhan (kg)", "Stok (kg)", "Belanja (kg)", "Harga/kg (Rp)", "Biaya (Rp)"], ...computed.map(x => [x.name, x.portion, x.required.toFixed(2), x.stock, x.buy.toFixed(2), x.price, Math.round(x.subtotal)]), ["Total (Rp)", Math.round(total)]]); setMessage("Rencana belanja berhasil diekspor sebagai CSV."); }}><Icon name="download" size={18}/>Ekspor daftar belanja</button></PageHeading>
    <section className="planning-tip"><img src="/brand/porsi.png" alt="" width="90" height="93"/><div><h2>Data sisa memberi petunjuk.</h2><p>Rata-rata sisa sayur pada catatan dapur: <b>{number(meanVeg)}%</b>. Tinjau bersama ahli gizi sebelum mengubah standar bahan per porsi.</p></div></section>
    <section className="panel plan-settings"><div><h2>Atur siklus menu</h2><p>Menu: ayam kecap, tumis sayur, dan semangka.</p></div><label>Porsi yang disiapkan<input type="number" min="1" max="10000" value={Number.isNaN(portions) ? "" : portions} onChange={e => setPortions(e.target.value === "" ? NaN : Number(e.target.value))}/></label><label>Cadangan bahan (%)<input type="number" min="0" max="30" value={Number.isNaN(buffer) ? "" : buffer} onChange={e => setBuffer(e.target.value === "" ? NaN : Number(e.target.value))}/></label></section>
    <section className="panel shopping-panel"><div className="panel-heading"><div><h2>Daftar kebutuhan bahan</h2><p>Ubah standar bahan mentah, stok, dan harga sesuai dapurmu.</p></div></div><p className="table-hint">Geser tabel untuk melihat stok, belanja, dan harga.</p><div className="table-scroll"><table className="data-table shopping-table"><thead><tr><th>Bahan</th><th>g/porsi mentah</th><th>Butuh + cadangan</th><th>Stok (kg)</th><th>Belanja</th><th>Harga/kg (Rp)</th><th>Estimasi biaya</th></tr></thead><tbody>{computed.map((item, i) => <tr key={item.name}><td><div className="food-name"><FoodIcon index={i}/><b>{item.name}</b></div></td><td><input aria-label={"Gram per porsi " + item.name} type="number" min="1" max="1000" value={Number.isNaN(item.portion) ? "" : item.portion} onChange={e => edit(i, "portion", e.target.value)}/></td><td>{valid ? number(item.required, 2) + " kg" : "—"}</td><td><input aria-label={"Stok kilogram " + item.name} type="number" min="0" max="100000" step="0.1" value={Number.isNaN(item.stock) ? "" : item.stock} onChange={e => edit(i, "stock", e.target.value)}/></td><td><b className="buy-value">{valid ? number(item.buy, 2) + " kg" : "—"}</b></td><td><input aria-label={"Harga per kilogram " + item.name} type="number" min="0" step="500" value={Number.isNaN(item.price) ? "" : item.price} onChange={e => edit(i, "price", e.target.value)}/></td><td><b>{valid ? rupiah(item.subtotal) : "—"}</b></td></tr>)}</tbody></table></div><div className="shopping-total"><span>Estimasi total belanja<small>Belum termasuk bumbu dan biaya lain</small></span><strong>{valid ? rupiah(total) : "—"}</strong></div></section>
    {!valid && <p role="alert" className="form-error">Periksa isian: porsi 1–10.000, cadangan 0–30%, bahan 1–1.000 g/porsi, serta stok dan harga bernilai nol atau lebih.</p>}
    <div className="notice notice-blue"><Icon name="info"/><div><b>Rencana ini perlu ditinjau sebelum dipesan.</b><p>Kebutuhan = porsi × gram bahan mentah × cadangan, dikurangi stok tersedia. Data sisa tidak otomatis mengurangi porsi gizi. Rasio bahan mentah, rendemen, serta menu perlu disesuaikan oleh tim dapur.</p></div></div>
    <p className="data-disclaimer">Perubahan rencana berlaku pada halaman ini. Ekspor daftar belanja sebelum berpindah halaman untuk menyimpan salinannya.</p>
    {message && <div className="toast" role="status"><Icon name="check" size={18}/>{message}</div>}
  </>;
}
