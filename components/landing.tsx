"use client";
import { useState } from "react";
import Link from "next/link";
import { Brand, FoodIcon, Icon, TrayPhoto } from "./ui";
import MotionSurface from "./motion-surface";
import PorsiGuide from "./porsi-guide";
import FeatureStory from "./feature-story";

function Step({ n, active, onSelect, children }: { n: number; active: number; onSelect: (step: number) => void; children: React.ReactNode }) {
  return <button type="button" className="journey-label" aria-pressed={active === n} onClick={() => onSelect(n)} aria-controls="journey-description"><span>{n}</span>{children}</button>;
}
const journeyNotes = [
  { text: "Ambil foto sebelum dan sesudah dari sudut yang sama. Mulai dengan ompreng contoh atau foto dari perangkatmu.", action: "Mulai foto ompreng", href: "/foto/" },
  { text: "Lihat sisa tiap komponen menu, lalu tinjau estimasinya bersama tim dapur.", action: "Jelajahi hasil pengamatan", href: "/hasil/" },
  { text: "Atur jumlah porsi dan stok yang tersedia untuk menghitung kebutuhan bahan berikutnya.", action: "Susun rencana belanja", href: "/belanja/" },
];
export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [introReplay, setIntroReplay] = useState(0);
  const note = journeyNotes[activeStep - 1];
  return <MotionSurface intro replayKey={introReplay}>
    <header className="landing-nav wrap">
      <Brand/>
      <nav aria-label="Navigasi utama" className={menu ? "nav-links is-open" : "nav-links"}>
        <a href="#cara-kerja" onClick={() => setMenu(false)}>Cara kerja</a>
        <a href="#fitur" onClick={() => setMenu(false)}>Fitur</a>
        <a href="#paket" onClick={() => setMenu(false)}>Paket</a>
        <Link className="btn btn-sun" href="/dasbor/">Buka dasbor</Link>
      </nav>
      <button className="icon-btn mobile-only" aria-label={menu ? "Tutup menu" : "Buka menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"}/></button>
    </header>
    <main id="main">
      <section className="landing-hero wrap">
        <h1 data-motion="text">Foto ompreng. Tahu sisa.<br className="tablet-break"/> <span>Belanja tepat.</span></h1>
        <p className="hero-copy" data-motion="rise" data-motion-order="1">Ubah foto sebelum dan sesudah makan menjadi data sisa per komponen dan rencana belanja dapur.</p>
        <div className="hero-actions" data-motion="rise" data-motion-order="2"><Link href="/dasbor/" className="btn btn-sun btn-large">Buka dasbor</Link><a href="#cara-kerja" className="btn btn-outline btn-large">Lihat cara kerja</a></div>
        <div className="journey" id="cara-kerja" data-active-step={activeStep} role="group" aria-label="Jelajahi tiga langkah TUNTAS">
          <div className="journey-stage stage-photo" data-motion="photo">
            <Step n={1} active={activeStep} onSelect={setActiveStep}>Foto ompreng</Step>
            <div className="tray-pair">
              <div><TrayPhoto/><span>Sebelum makan</span></div>
              <div><TrayPhoto after/><span>Sesudah makan</span></div>
            </div>
          </div>
          <PorsiGuide/>
          <div className="journey-stage stage-result" data-motion="rise" data-motion-order="1">
            <Step n={2} active={activeStep} onSelect={setActiveStep}>Kenali sisanya</Step>
            <div className="mini-result">

              <div className="mini-table-head"><span>Komponen</span><span>Sisa sampel</span></div>
              {["Karbohidrat", "Lauk", "Sayur", "Buah"].map((n, i) => <div className="mini-table-row" key={n}><FoodIcon index={i}/><span>{n}</span><b>{["0,81", "0,17", "0,77", "0,15"][i]} <small>kg</small></b></div>)}
              <p className="mini-footnote">30 ompreng · estimasi sisa</p>
            </div>
          </div>
          <div className="journey-stage stage-plan" data-motion="rise" data-motion-order="2">
            <Step n={3} active={activeStep} onSelect={setActiveStep}>Susun belanja</Step>
            <div className="clipboard">
              <span className="clipboard-clip" aria-hidden="true"/>
              <h3>Rencana belanja<br/>dapur</h3>
              {["Kentang", "Ayam", "Sayuran"].map((n, i) => <div key={n}><span className="round-check" data-motion="stamp" data-motion-order={i}><Icon name="check" size={15}/></span><b>{n}</b><span className="list-line" style={{ width: [40, 54, 34][i] }}/></div>)}
              <Link href="/belanja/">Lihat rencana belanja<Icon name="chevron" size={16}/></Link>
            </div>
          </div>
        </div>
        <div className="journey-note"><span className="journey-note-number" aria-hidden="true">{activeStep}</span><p id="journey-description" role="status" aria-live="polite" aria-atomic="true">{note.text}</p><Link href={note.href} className="text-link">{note.action}<Icon name="chevron" size={16}/></Link></div>
      </section>
      <section className="farmer-section" id="fitur">
        <div className="wrap farmer-inner">
          <div><h2 data-motion="text">Dari dapur,<br/>kembali ke <span>petani.</span></h2><p>Kenali yang benar-benar dimakan. Gunakan data sisa untuk meninjau menu dan memperkirakan kebutuhan bahan berikutnya.</p><Link href="/belanja/" className="text-link light">Jelajahi rencana belanja<Icon name="chevron" size={18}/></Link></div>
          <div className="procurement-preview" data-motion="photo">
            <div className="procurement-title"><span className="food-icon food-2"><Icon name="cart" size={29}/></span><div><h3>Belanja lebih terencana</h3><p>Kebutuhan bahan untuk satu siklus menu</p></div></div>
            <div className="commodity-grid">{["Kentang", "Ayam", "Sayuran", "Anggur"].map((n, i) => <div key={n}><FoodIcon index={i}/><span>{n}</span><strong>{["34", "19", "19", "21"][i]} <small>kg</small></strong></div>)}</div>
            <p className="quiet">Sesuaikan kebutuhan bahan bersama tim dapur.</p>
          </div>
        </div>
      </section>
      <section className="wrap decisions">
        <div className="section-heading"><h2>Yang tersisa,<br/>jadi bahan evaluasi.</h2><p>Satu alur sederhana untuk petugas dapur, ahli gizi, dan pengelola. Semua keputusan tetap ada di tangan timmu.</p></div>
        <FeatureStory/>
      </section>
      <section className="pricing-section" id="paket"><div className="wrap">
        <div className="section-heading"><h2>Mulai dari kebutuhan dapurmu.</h2><p>Pilih paket yang sesuai untuk pencatatan harian hingga perencanaan bahan dapur.</p></div>
        <div className="pricing-grid">
          <article className="price-card sticker" data-motion="rise"><h3>Dasar</h3><p>Untuk mulai mengenali sisa makanan.</p><div className="price">Rp750.000<span>/dapur/bulan</span></div><ul><li><Icon name="check"/>Foto sebelum dan sesudah</li><li><Icon name="check"/>Dasbor sisa per komponen</li><li><Icon name="check"/>Laporan sisa pangan bulanan</li></ul><Link href="/dasbor/" className="btn btn-outline">Buka dasbor</Link></article>
          <article className="price-card price-pro sticker" data-motion="rise" data-motion-order="1"><h3>Pro</h3><p>Dari data sisa ke perencanaan bahan.</p><div className="price">Rp1.250.000<span>/dapur/bulan</span></div><ul><li><Icon name="check"/>Semua fitur Dasar</li><li><Icon name="check"/>Bahan evaluasi menu per komponen</li><li><Icon name="check"/>Rencana belanja dan ekspor data</li><li><Icon name="check"/>Pemantauan beberapa sekolah</li></ul><Link href="/belanja/" className="btn btn-sun">Coba rencana belanja</Link></article>
          <aside className="pricing-aside" data-motion="stamp"><img src="/brand/porsi-plan.png" alt="" width="160" height="165"/><h3>Kenalan dulu<br/>dengan Porsi.</h3><p>Mulai dari foto ompreng, kenali sisanya, lalu susun kebutuhan belanja dapur.</p><Link className="text-link" href="/foto/">Mulai dari foto<Icon name="chevron" size={18}/></Link></aside>
        </div>
      </div></section>
      <section className="wrap faq"><h2>Sebelum mulai.</h2><div>
        <details><summary>Bagaimana membaca hasil estimasi?<Icon name="plus"/></summary><p>Lihat rincian sisa pada setiap komponen menu, lalu bandingkan dengan catatan hari sebelumnya. Tinjau dan sesuaikan estimasi bersama tim sebelum menggunakannya untuk evaluasi menu.</p></details>
        <details><summary>Ke mana foto yang saya unggah disimpan?<Icon name="plus"/></summary><p>Foto diperkecil dan disimpan di browser perangkat ini. Tidak ada unggahan ke server. Gunakan foto ompreng tanpa wajah siswa. Menghapus data browser juga akan menghapus riwayat pada perangkat ini.</p></details>
        <details><summary>Apakah saran porsi bisa langsung diterapkan?<Icon name="plus"/></summary><p>Saran porsi menjadi bahan diskusi bersama tim dapur dan ahli gizi. Perubahan menu dan porsi harus ditinjau oleh ahli gizi serta tetap memenuhi kebutuhan penerima makanan.</p></details>
      </div></section>
      <section className="closing"><div className="wrap"><h2>Kenali sisanya.<br/>Rencanakan berikutnya.</h2><Link href="/dasbor/" className="btn btn-sun btn-large">Mulai bersama TUNTAS</Link></div></section>
    </main>
    <footer className="wrap footer"><Brand/><p>Foto ompreng, tahu sisa, belanja tepat.</p><button type="button" className="intro-replay" onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); setIntroReplay(n => n + 1); }}>Putar sapaan Porsi</button><span>© 2026 TUNTAS</span></footer>
  </MotionSurface>;
}
