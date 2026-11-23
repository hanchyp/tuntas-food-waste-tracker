"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand, Icon } from "./ui";
import { useDemo } from "./demo-context";
import MotionSurface from "./motion-surface";
const links = [
  { href: "/dasbor/", label: "Dasbor", icon: "grid" },
  { href: "/foto/", label: "Foto ompreng", icon: "camera" },
  { href: "/riwayat/", label: "Riwayat", icon: "history" },
  { href: "/belanja/", label: "Rencana belanja", icon: "cart" },
  { href: "/laporan/", label: "Laporan", icon: "file" },
];
export default function DemoShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { warning } = useDemo();
  return <div className="app-shell">
    <a className="skip-link" href="#app-main">Lewati navigasi</a>
    <aside className="sidebar">
      <Brand/><div className="workspace"><span className="workspace-icon"><Icon name="home"/></span><div><b>Dapur Nusantara</b><small>Solo Raya</small></div></div>
      <nav aria-label="Navigasi aplikasi">{links.map(l => <Link key={l.href} href={l.href} className={path === l.href || (path === "/hasil/" && l.href === "/riwayat/") ? "app-nav-link active" : "app-nav-link"} aria-current={path === l.href ? "page" : undefined}><Icon name={l.icon}/><span>{l.label}</span>{l.icon === "camera" && <span className="nav-plus">+</span>}</Link>)}</nav>
      <div className="sidebar-helper"><img src="/brand/porsi.png" alt="" width="100" height="103"/><h3>Sedikit sisa,<br/>banyak cerita.</h3><p>Yuk, lihat apa yang bisa dipelajari dari menu hari ini.</p><Link href="/foto/">Foto ompreng<Icon name="chevron" size={16}/></Link></div>
      <Link href="/" className="back-home"><Icon name="back" size={18}/>Kembali ke beranda</Link>
    </aside>
    <div className="app-body">
      <header className="app-header"><div className="header-breadcrumb"><span className="desktop-only">Dapur Nusantara</span><span className="mobile-brand"><Brand/></span><span className="header-divider desktop-only">/</span><span className="desktop-only">{links.find(l => l.href === path)?.label ?? "Hasil analisis"}</span></div><div className="app-header-right"><span className="avatar" aria-label="Dapur Nusantara">DN</span></div></header>
      {warning && <div className="storage-warning" role="status">{warning}</div>}
      <main id="app-main" className="app-main"><MotionSurface key={path}>{children}</MotionSurface></main>
      <footer className="app-footer"><span>TUNTAS · Dapur lebih terencana.</span><span>© 2026 TUNTAS</span></footer>
    </div>
    <nav className="mobile-app-nav" aria-label="Navigasi aplikasi ponsel">{links.map(l => <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""} aria-current={path === l.href ? "page" : undefined}><Icon name={l.icon} size={21}/><span>{l.icon === "cart" ? "Belanja" : l.icon === "camera" ? "Foto" : l.label}</span></Link>)}</nav>
  </div>;
}
