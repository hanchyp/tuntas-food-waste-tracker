"use client";
import { useEffect, useRef, useState } from "react";
import { number } from "@/lib/data";

/** Angka yang menghitung naik dari nilai sebelumnya. Langsung tampil bila reduced-motion aktif. */
export default function CountUp({ value, digits = 1, duration = 650 }: { value: number; digits?: number; duration?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (start === value || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) { setShown(value); return; }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(start + (value - start) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); setShown(value); };
  }, [value, duration]);
  return <span className="count-up">{number(shown, digits)}</span>;
}
