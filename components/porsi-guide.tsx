"use client";
import { useEffect, useRef, useState } from "react";

export default function PorsiGuide() {
  const body = useRef<HTMLSpanElement>(null);
  const animation = useRef<Animation | null>(null);
  const [greeting, setGreeting] = useState(false);
  useEffect(() => {
    if (!greeting) return;
    const timer = window.setTimeout(() => setGreeting(false), 3000);
    return () => clearTimeout(timer);
  }, [greeting]);
  useEffect(() => () => animation.current?.cancel(), []);
  function greet() {
    setGreeting(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animation.current?.cancel();
    animation.current = body.current?.animate([
      { transform: "rotate(0deg) translateY(0)" },
      { transform: "rotate(-6deg) translateY(-9px)", offset: .28 },
      { transform: "rotate(5deg) translateY(-3px)", offset: .6 },
      { transform: "rotate(0deg) translateY(0)" },
    ], { duration: 750, easing: "cubic-bezier(.22,1,.36,1)" }) ?? null;
  }
  return <div className="hero-porsi">
    <button className="porsi-greeting-button" type="button" onClick={greet} aria-label="Sapa Porsi" aria-describedby={greeting ? "porsi-greeting" : undefined}>
      <span ref={body} className="porsi-greeting-body"><img src="/brand/porsi.png" alt="Porsi, maskot TUNTAS berbentuk sendok nasi yang menyapa" width="621" height="640" fetchPriority="high"/></span>
    </button>
    <span className="porsi-invitation" aria-hidden="true">Sapa Porsi</span>
    {greeting && <span id="porsi-greeting" className="porsi-bubble" role="status">Hai! Yuk, kenali cerita di omprengmu.</span>}
  </div>;
}
