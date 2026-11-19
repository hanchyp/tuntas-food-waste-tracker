"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "./demo-context";
import { Icon, TrayPhoto } from "./ui";
import { PageHeading } from "./dashboard";
import { components, dateLabel, schools, type Report } from "@/lib/data";
import TrayScanner from "./tray-scanner";

async function readImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Gunakan foto JPG, PNG, atau WebP.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Foto maksimal 10 MB. Pilih foto yang lebih kecil.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas"); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) { bitmap.close(); throw new Error("Foto tidak dapat diproses. Coba browser lain."); }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.7);
}
export default function Capture() {
  const router = useRouter(); const { addReport, ready } = useDemo();
  const [step, setStep] = useState(0); const [school, setSchool] = useState(schools[0]);
  const [date, setDate] = useState("2026-11-19"); const [menu, setMenu] = useState("Ayam goreng, kentang & sayuran");
  const [samples, setSamples] = useState(30); const [portions, setPortions] = useState(300);
  const [before, setBefore] = useState<string>(); const [after, setAfter] = useState<string>();
  const [example, setExample] = useState(false); const [error, setError] = useState("");
  const [reading, setReading] = useState(false); const [processing, setProcessing] = useState(false); const [progress, setProgress] = useState(0);
  const pending = useRef<Report | null>(null);
  useEffect(() => { const now = new Date(); setDate([now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-")); }, []);
  useEffect(() => {
    if (!processing) return;
    const timer = setInterval(() => setProgress(p => Math.min(3, p + 1)), 1100);
    const finish = setTimeout(() => { if (pending.current) { addReport(pending.current); router.push("/hasil/?id=" + pending.current.id); } }, 4700);
    return () => { clearInterval(timer); clearTimeout(finish); };
    // The staged simulation must run once; the pending record is held in a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processing, router]);
  async function upload(file: File | undefined, side: "before" | "after") {
    if (!file) return; setReading(true); setError("");
    try { const image = await readImage(file); if (side === "before") setBefore(image); else setAfter(image); setExample(false); }
    catch (e) { setError(e instanceof Error ? e.message : "Foto tidak dapat dibaca. Coba foto lain."); }
    finally { setReading(false); }
  }
  function next() {
    setError("");
    if (step === 0 && (!date || !menu.trim() || !Number.isInteger(samples) || !Number.isInteger(portions) || samples < 1 || portions < samples || portions > 10000)) { setError("Isi tanggal dan menu. Jumlah sampel harus 1–10.000 dan tidak melebihi porsi distribusi."); return; }
    if (step === 1 && !example && (!before || !after)) { setError("Tambahkan foto sebelum dan sesudah, atau gunakan foto contoh."); return; }
    setStep(s => s + 1);
  }
  function analyze() {
    if (!ready || reading || processing) return;
    pending.current = { id: "TNT-" + Date.now(), school, date, menu: menu.trim(), samples, portions, components: components.map(c => ({ ...c, food: menu.includes("panggang") ? ({ Kentang: "Kentang panggang", Lauk: "Ayam panggang", Sayur: "Capcai", Buah: "Semangka" }[c.name] ?? c.food) : c.food })), before: example ? undefined : before, after: example ? undefined : after, source: example ? "contoh" : "unggahan" };
    setProcessing(true);
  }
  if (processing) return <TrayScanner before={example ? undefined : before} after={example ? undefined : after} progress={progress}/>;
  return <>
    <PageHeading title="Foto ompreng" description="Dua foto, satu langkah kecil untuk dapur yang lebih terencana."/>
    <div className="capture-layout"><div className="panel capture-panel">
      <ol className="stepper" aria-label="Tahapan pencatatan">{["Data menu", "Pasangan foto", "Tinjau"].map((s, i) => <li key={s} className={step === i ? "active" : step > i ? "done" : ""} aria-current={step === i ? "step" : undefined}><span>{step > i ? <Icon name="check" size={16}/> : i + 1}</span><b>{s}</b></li>)}</ol>
      <form onSubmit={e => { e.preventDefault(); if (step < 2) next(); else analyze(); }}>
        {step === 0 && <div className="form-section"><h2>Menu apa yang disajikan?</h2><p>Catat satu sekolah dan satu menu untuk setiap pasangan foto.</p>
          <label>Sekolah<select value={school} onChange={e => setSchool(e.target.value)}>{schools.map(s => <option key={s}>{s}</option>)}</select></label>
          <div className="form-grid"><label>Tanggal penyajian<input type="date" required value={date} onChange={e => setDate(e.target.value)}/></label><label>Menu<select value={menu} onChange={e => setMenu(e.target.value)}><option>Ayam goreng, kentang & sayuran</option><option>Ayam panggang & capcai</option></select></label></div>
          <div className="form-grid"><label>Ompreng sampel<input type="number" min="1" max="10000" required value={samples || ""} onChange={e => setSamples(Number(e.target.value))}/><small>Jumlah ompreng yang diwakili pencatatan.</small></label><label>Porsi distribusi<input type="number" min={samples || 1} max="10000" required value={portions || ""} onChange={e => setPortions(Number(e.target.value))}/><small>Total porsi untuk sekolah ini.</small></label></div>
          <div className="inline-note"><Icon name="info" size={18}/>Catat setiap ompreng secara konsisten agar sampel dapat dibandingkan antarmenu dan sekolah.</div>
        </div>}
        {step === 1 && <div className="form-section"><h2>Foto sebelum dan sesudah.</h2><p>Ambil dari atas, seluruh sekat terlihat, dengan pencahayaan yang sama.</p><button type="button" className="btn btn-outline example-button" onClick={() => { setExample(true); setMenu("Ayam goreng, kentang & sayuran"); setBefore(undefined); setAfter(undefined); setError(""); }}><Icon name="camera" size={18}/>Gunakan foto contoh</button>
          <div className="photo-upload-grid">{(["before", "after"] as const).map((side, i) => { const src = side === "before" ? before : after; return <div className="photo-upload" key={side}><h3>{i === 0 ? "Sebelum makan" : "Sesudah makan"}</h3>{(example || src) ? <TrayPhoto after={i === 1} src={src}/> : <div className="upload-placeholder"><Icon name="camera" size={38}/><p>Seluruh ompreng terlihat</p></div>}<label className="btn btn-outline upload-label">{reading ? "Memproses foto…" : src ? "Ganti foto" : "Pilih foto"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={reading} aria-label={i === 0 ? "Unggah foto sebelum makan" : "Unggah foto sesudah makan"} onChange={e => upload(e.target.files?.[0], side)}/><Icon name="upload" size={17}/></label><small>{example ? "Ilustrasi contoh dipilih" : src ? "Foto siap digunakan" : "JPG, PNG, WebP · maks. 10 MB"}</small></div>; })}</div><div className="inline-note"><Icon name="info" size={18}/>Foto disimpan di browser ini. Hindari wajah siswa dan informasi pribadi.</div></div>}
        {step === 2 && <div className="form-section"><h2>Siap melihat hasil pengamatan?</h2><p>Periksa kembali data pencatatanmu.</p><dl className="review-data"><div><dt>Sekolah</dt><dd>{school}</dd></div><div><dt>Menu</dt><dd>{menu}</dd></div><div><dt>Tanggal</dt><dd>{dateLabel(date)}</dd></div><div><dt>Cakupan</dt><dd>{samples} sampel dari {portions} porsi</dd></div></dl><div className="review-photos"><TrayPhoto src={before}/><TrayPhoto after src={after}/></div></div>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-navigation">{step > 0 ? <button type="button" className="btn btn-outline" onClick={() => { setStep(s => s - 1); setError(""); }}>Kembali</button> : <span/>}<button className="btn btn-sun" type="submit" disabled={reading || !ready}>{step === 2 ? "Lihat hasil pengamatan" : "Lanjutkan"}<Icon name={step === 2 ? "chart" : "chevron"} size={18}/></button></div>
      </form>
    </div><aside className="capture-help"><img src="/brand/porsi.png" alt="" width="170" height="175"/><h3>Hai, aku Porsi!</h3><p>Aku bantu kamu menyiapkan foto yang mudah dibandingkan.</p><ul><li><Icon name="check"/>Kamera tegak lurus dari atas.</li><li><Icon name="check"/>Gunakan ompreng yang sama.</li><li><Icon name="check"/>Jangan pindahkan sisa antarsekat.</li><li><Icon name="check"/>Jauhkan wajah dari bingkai foto.</li></ul><span className="quiet">Foto konsisten membantu evaluasi yang lebih baik.</span></aside></div>
  </>;
}
