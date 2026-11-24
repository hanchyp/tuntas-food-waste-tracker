"use client";
import Link from "next/link";
import { requestIntroReplay } from "@/lib/intro-replay";

/** Tautan logo ke beranda yang selalu memutar ulang intro Porsi. */
export default function HomeLink({ className, ariaLabel, children }: { className?: string; ariaLabel?: string; children: React.ReactNode }) {
  return <Link href="/" scroll={false} className={className} aria-label={ariaLabel} onClick={e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    requestIntroReplay();
  }}>{children}</Link>;
}
