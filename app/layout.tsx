import type { Metadata } from "next";
import "./globals.css";
import "./motion.css";

export const metadata: Metadata = {
  title: { default: "TUNTAS — Foto ompreng. Belanja tepat.", template: "%s · TUNTAS" },
  description: "Kenali sisa makanan per komponen, evaluasi menu, dan susun rencana belanja bahan dapur bersama TUNTAS.",
  icons: { icon: "/favicon.png", apple: "/apple-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
