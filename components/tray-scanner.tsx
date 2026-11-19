"use client";
import { useEffect, useRef } from "react";
import { Icon, TrayPhoto } from "./ui";

const stages = [
  "Menyiapkan pasangan foto",
  "Meninjau foto sebelum makan",
  "Meninjau foto sesudah makan",
  "Menyusun ringkasan pengamatan",
];

export default function TrayScanner({ before, after, progress }: { before?: string; after?: string; progress: number }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const showAfter = progress >= 2;
  const finished = progress === 3;
  return <section className="tray-scanner" aria-labelledby="scanner-title">
    <div className={"scanner-device " + (finished ? "scan-finished" : "scan-running")}>
      <div className="scanner-toolbar"><span className="scanner-state"><i aria-hidden="true"/>{finished ? "Foto siap ditinjau" : "Pemindaian foto"}</span><Icon name={finished ? "check" : "camera"} size={19}/></div>
      <div className="scanner-viewport">
        <div className="scanner-photo-layer scanner-before" data-active={!showAfter}><TrayPhoto src={before}/></div>
        <div className="scanner-photo-layer scanner-after" data-active={showAfter}><TrayPhoto src={after} after/></div>
        <div className="scanner-shade" aria-hidden="true"/>
        <div className="scanner-corners" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="scanner-sweep" aria-hidden="true"><span/></div>
        <span className="scanner-photo-label">{showAfter ? "Sesudah makan" : "Sebelum makan"}</span>
        {finished && <div className="scanner-complete" aria-hidden="true"><Icon name="check" size={32}/></div>}
      </div>
      <div className="scanner-photo-tabs" aria-label="Urutan foto">
        <div className={!showAfter ? "is-current" : "is-reviewed"}><span>{showAfter ? <Icon name="check" size={13}/> : "1"}</span>Sebelum makan</div>
        <div className={showAfter ? "is-current" : ""}><span>{finished ? <Icon name="check" size={13}/> : "2"}</span>Sesudah makan</div>
      </div>
    </div>
    <div className="scanner-copy">
      <img src="/brand/porsi.png" alt="" width="90" height="93"/>
      <h1 id="scanner-title" ref={heading} tabIndex={-1}>{finished ? "Ringkasanmu hampir siap." : "Memindai ompreng."}</h1>
      <p>Menyiapkan pasangan foto dan catatan menu untuk hasil pengamatanmu.</p>
      <ol className="scanner-stages" aria-label="Tahapan pemrosesan">
        {stages.map((stage, i) => <li key={stage} className={progress > i ? "is-done" : progress === i ? "is-current" : ""} aria-current={progress === i ? "step" : undefined}><span>{progress > i ? <Icon name="check" size={14}/> : i + 1}</span>{stage}</li>)}
      </ol>
      <div className="scanner-live" role="status" aria-live="polite" aria-atomic="true">{stages[progress]}…</div>
    </div>
  </section>;
}
