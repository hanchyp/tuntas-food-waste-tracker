import Link from "next/link";
export default function NotFound() { return <main className="empty" style={{ minHeight: "100vh", display: "grid", placeContent: "center" }}><img src="/brand/porsi.png" alt="" width="150" height="155"/><h1>Halaman ini belum ditemukan.</h1><p>Porsi bisa membantumu kembali ke dapur.</p><Link className="btn btn-sun" href="/dasbor/">Buka dasbor demo</Link></main>; }
