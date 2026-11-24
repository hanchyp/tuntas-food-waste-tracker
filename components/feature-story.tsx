"use client";
import { useEffect, useRef, useState } from "react";
import { FoodIcon, Icon, TrayPhoto } from "./ui";

const features = [
  { icon: "camera", title: "Foto, tanpa alat khusus", text: "Dokumentasikan sampel ompreng sebelum dan sesudah makan dari ponsel." },
  { icon: "chart", title: "Lihat per komponen", text: "Bedakan sisa karbohidrat, lauk, sayur, dan buah. Jangan biarkan semuanya menjadi satu angka." },
  { icon: "cart", title: "Hubungkan ke kebutuhan bahan", text: "Tinjau rencana belanja dalam kilogram, sesuaikan porsi, lalu ekspor untuk pemasok." },
];

function Visual({ index }: { index: number }) {
  if (index === 0) return <div className="story-photos"><div><TrayPhoto/><span>Sebelum makan</span></div><div><TrayPhoto after/><span>Sesudah makan</span></div></div>;
  if (index === 1) return <>
    <div className="feature-demo-top"><Icon name="chart"/><b>Sisa per komponen</b></div>
    {["Karbohidrat", "Lauk", "Sayur", "Buah"].map((n, i) => <div className="feature-bar" key={n}><span>{n}</span><div><i style={{ width: [18, 8, 32, 5][i] + "%", background: i === 2 ? "var(--amber)" : "var(--leaf)" }}/></div><b>{[18, 8, 32, 5][i]}%</b></div>)}
    <div className="feature-note"><Icon name="info" size={20}/><p><b>Sayur perlu ditinjau.</b> Bandingkan menu, cara masak, dan porsi bersama ahli gizi.</p></div>
  </>;
  return <>
    <div className="feature-demo-top"><Icon name="cart"/><b>Rencana belanja</b></div>
    {["Kentang", "Ayam", "Sayuran", "Anggur"].map((n, i) => <div className="story-buy" key={n}><FoodIcon index={i}/><span>{n}</span><b>{["34", "19", "19", "21"][i]} <small>kg</small></b></div>)}
    <div className="story-buy-total"><span>Siap diekspor untuk pemasok</span><Icon name="download" size={18}/></div>
  </>;
}

/**
 * Kartu fitur yang tertahan di layar sementara pengguna menggulir (pola WANA).
 * Tanpa JS, layar pendek, atau reduced-motion: tampil sebagai daftar biasa.
 */
export default function FeatureStory() {
  const root = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tall = window.matchMedia("(min-height: 560px)");
    const decide = () => setPinned(!motion.matches && tall.matches);
    decide();
    motion.addEventListener("change", decide); tall.addEventListener("change", decide);
    return () => { motion.removeEventListener("change", decide); tall.removeEventListener("change", decide); };
  }, []);
  useEffect(() => {
    if (!pinned) return;
    const update = () => {
      const el = root.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0;
      setActive(Math.min(features.length - 1, Math.floor(progress * features.length)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [pinned]);
  function go(i: number) {
    const el = root.current; if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + total * (i + .5) / features.length, behavior: "smooth" });
  }
  return <div ref={root} className={pinned ? "story is-pinned" : "story"} data-active={active}>
    <div className="story-sticky">
      <div className="story-visual sticker" aria-hidden="true">
        {pinned ? features.map((_, i) => <div key={i} className="story-layer" data-active={i === active}><Visual index={i}/></div>) : <Visual index={1}/>}
      </div>
      <div className="story-copy">
        {features.map((f, i) => <article key={f.title} data-active={!pinned || i === active}><span><Icon name={f.icon}/></span><div><h3>{f.title}</h3><p>{f.text}</p></div></article>)}
        {pinned && <div className="story-dots" role="group" aria-label="Pilih fitur">{features.map((f, i) => <button key={f.title} type="button" aria-label={f.title} aria-pressed={i === active} onClick={() => go(i)}/>)}</div>}
      </div>
    </div>
  </div>;
}
