"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_KEY = "tuntas-porsi-welcome-v1";
const EASE = "cubic-bezier(.22,1,.36,1)";

/** Progressive enhancement: content stays readable without JS, observers, or motion. */
export default function MotionSurface({ children, intro = false, replayKey = 0 }: {
  children: React.ReactNode; intro?: boolean; replayKey?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [welcoming, setWelcoming] = useState(false);
  const [ready, setReady] = useState(!intro);
  const finishWelcome = useCallback(() => {
    setWelcoming(false); setReady(true);
    try { sessionStorage.setItem(INTRO_KEY, "seen"); } catch { /* Session storage is optional. */ }
  }, []);

  useEffect(() => {
    if (!intro) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWelcoming(false); setReady(true); return;
    }
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_KEY) === "seen"; } catch { /* Still usable without storage. */ }
    if (seen && replayKey === 0) { setReady(true); return; }
    setWelcoming(true); setReady(false);
    const timer = window.setTimeout(finishWelcome, 1150);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (media.matches) finishWelcome(); };
    media.addEventListener("change", reduce);
    return () => { clearTimeout(timer); media.removeEventListener("change", reduce); };
  }, [intro, replayKey, finishWelcome]);

  useEffect(() => {
    const scope = root.current;
    if (!scope || !ready || welcoming || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const selector = "[data-motion], .app-main .page-heading, .app-main .panel, .app-main .dashboard-welcome, .app-main .planning-tip, .app-main .recommendation";
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const node = entry.target as HTMLElement;
        observer.unobserve(node);
        if (seen.has(node)) continue;
        seen.add(node);
        if (preference.matches || document.hidden || node.contains(document.activeElement)) continue;
        const effect = node.dataset.motion ?? "rise";
        const frames: Keyframe[] = effect === "text"
          ? [{ clipPath: "inset(0 100% 0 0)", opacity: .4 }, { clipPath: "inset(0 0% 0 0)", opacity: 1 }]
          : effect === "photo"
            ? [{ clipPath: "inset(0 0 100% 0 round 18px)" }, { clipPath: "inset(0 0 0% 0 round 18px)" }]
            : effect === "bar-y"
              ? [{ transform: "scaleY(0)", transformOrigin: "bottom" }, { transform: "scaleY(1)", transformOrigin: "bottom" }]
            : effect === "bar"
              ? [{ transform: "scaleX(0)", transformOrigin: "left" }, { transform: "scaleX(1)", transformOrigin: "left" }]
              : effect === "stamp"
                ? [{ transform: "scale(.88) rotate(-4deg)", opacity: .2 }, { transform: "scale(1) rotate(0)", opacity: 1 }]
                : [{ transform: "translateY(22px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }];
        const animation = node.animate(frames, {
          duration: effect === "text" ? 620 : 520,
          delay: Math.min(Number(node.dataset.motionOrder ?? 0) * 75, 225),
          easing: EASE,
        });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .12, rootMargin: "0px 0px -20px 0px" });
    const watch = () => {
      for (const node of scope.querySelectorAll<HTMLElement>(selector)) {
        if (!seen.has(node)) observer.observe(node);
      }
    };
    const cancel = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const onVisibility = () => { if (document.hidden) cancel(); };
    const onPreference = () => { if (preference.matches) cancel(); };
    watch();
    const changes = new MutationObserver(watch);
    changes.observe(scope, { childList: true, subtree: true });
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect(); changes.disconnect(); cancel();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, welcoming]);

  return <>
    <div ref={root} className="motion-surface" inert={welcoming}>{children}</div>
    {welcoming && <div className="porsi-intro" role="status" aria-label="Porsi menyambutmu di TUNTAS">
      <button className="intro-skip" onClick={finishWelcome}>Lewati intro</button>
      <div className="intro-center"><img src="/brand/logo.png" alt="TUNTAS" width="300" height="60"/><p>Kenali sisanya. Rencanakan berikutnya.</p><span className="intro-track" aria-hidden="true"><i/></span></div>
      <img className="intro-porsi intro-porsi-camera" src="/brand/porsi-camera.png" alt="" width="450" height="480"/>
      <img className="intro-porsi intro-porsi-plan" src="/brand/porsi-plan.png" alt="" width="450" height="480"/>
    </div>}
  </>;
}
