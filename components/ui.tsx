import type { CSSProperties } from "react";
import Link from "next/link";

const paths: Record<string, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  camera: <><path d="M14 4h-4L8 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="4"/></>,
  history: <><path d="M3 11a9 9 0 1 1 2.3 7M3 4v7h7"/><path d="M12 7v5l3 2"/></>,
  cart: <><path d="M2 3h3l3 13h11l3-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
  chart: <><path d="M4 3v18h17M9 16v-5M14 16V6M19 16V9"/></>,
  leaf: <><path d="M20 3C9 2 3 7 4 14s14 10 16-11Z"/><path d="M3 22 15 10"/></>,
  bowl: <><path d="M3 12h18a9 9 0 0 1-18 0ZM7 21h10M6 8c-1-2 2-2 1-4M12 8c-1-2 2-2 1-4M18 8c-1-2 2-2 1-4"/></>,
  chicken: <><path d="M15 3c5 0 8 6 4 10-2 2-5 2-7 1l-4 4a2 2 0 1 1-3 3 2 2 0 1 1-2-3l5-5C6 9 9 3 15 3Z"/></>,
  fruit: <><path d="M12 8c-7-6-13 3-7 11 3 4 4 1 7 1s4 3 7-1c6-8 0-17-7-11Z"/><path d="M12 8c0-4 2-6 5-6"/></>,
  check: <path d="m5 12 4 4L20 5"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  chevron: <path d="m8 4 8 8-8 8"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/></>,
  download: <><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
  search: <><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
  home: <><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/></>,
  back: <path d="m14 5-7 7 7 7M7 12h14"/>,
  print: <><path d="M6 8V2h12v6M6 17H3V8h18v9h-3M6 13h12v9H6z"/></>,
};
export function Icon({ name, size = 22, className = "" }: { name: string; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{paths[name] ?? paths.leaf}</svg>;
}
export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" aria-label="TUNTAS — Beranda" className="brand"><img src={light ? "/brand/logo-krem.png" : "/brand/logo.png"} alt="TUNTAS" width="203" height="40"/></Link>;
}
export function TrayPhoto({ after = false, src, className = "" }: { after?: boolean; src?: string; className?: string }) {
  const photo = src ?? (after ? "/images/ompreng-sesudah.png" : "/images/ompreng-sebelum.png");
  return <div className={"tray-photo " + (after ? "tray-after " : "") + className} role="img" aria-label={after ? "Ompreng sesudah makan" : "Ompreng sebelum makan"} style={{ backgroundImage: "url(" + photo + ")", backgroundSize: "contain", backgroundPosition: "center" } as CSSProperties}/>;
}
export function FoodIcon({ index }: { index: number }) {
  return <span className={"food-icon food-" + index}><Icon name={["bowl", "chicken", "leaf", "fruit"][index]} size={25}/></span>;
}
export function Empty({ title, text }: { title: string; text: string }) {
  return <div className="empty"><img src="/brand/porsi.png" alt="" width="120" height="124"/><h3>{title}</h3><p>{text}</p><Link className="btn btn-primary" href="/foto/">Foto ompreng</Link></div>;
}
