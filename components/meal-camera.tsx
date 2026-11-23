"use client";
import { useEffect, useRef, useState } from "react";
import { readImage } from "@/lib/photo";
import { Icon } from "./ui";

type Props = { side: "before" | "after"; onUse: (image: string) => void; onClose: () => void };
export default function MealCamera({ side, onUse, onClose }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"starting" | "ready" | "error">("starting");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string>();
  const [reading, setReading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const label = side === "before" ? "sebelum makan" : "sesudah makan";
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.closest(".meal-camera")?.scrollIntoView({ block: "start" });
  }, []);
  useEffect(() => {
    if (photo) return;
    let active = true;
    function stop() { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; }
    function pause() {
      if (document.hidden) { stop(); setStatus("error"); setError("Kamera dijeda. Ketuk Coba kamera lagi untuk melanjutkan."); }
    }
    async function start() {
      setStatus("starting"); setError("");
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        const media = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1600 }, height: { ideal: 1200 } } });
        if (!active || document.hidden) { media.getTracks().forEach(track => track.stop()); return; }
        stream.current = media;
        if (video.current) { video.current.srcObject = media; await video.current.play(); }
        if (active && !document.hidden) setStatus("ready");
      } catch (reason) {
        stop();
        if (!active) return;
        setStatus("error");
        setError(reason instanceof DOMException && reason.name === "NotAllowedError"
          ? "Akses kamera belum diizinkan. Izinkan kamera di pengaturan browser atau pilih foto dari galeri."
          : "Kamera tidak tersedia. Tutup aplikasi lain yang memakai kamera, lalu coba lagi atau pilih foto dari galeri.");
      }
    }
    void start(); document.addEventListener("visibilitychange", pause);
    return () => { active = false; stop(); document.removeEventListener("visibilitychange", pause); };
  }, [photo, attempt]);
  function capture() {
    const source = video.current;
    if (!source?.videoWidth || !source.videoHeight) { setError("Kamera belum siap. Tunggu sebentar lalu ambil foto kembali."); return; }
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 900 / Math.max(source.videoWidth, source.videoHeight));
    canvas.width = Math.round(source.videoWidth * scale); canvas.height = Math.round(source.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) { setError("Foto tidak dapat diambil. Pilih foto dari galeri."); return; }
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", .7)); setError("");
  }
  async function upload(file?: File) {
    if (!file) return;
    setReading(true); setError("");
    try { setPhoto(await readImage(file)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Foto tidak dapat dibaca. Pilih foto lain."); }
    finally { setReading(false); }
  }
  return <section className="meal-camera" aria-label={`Kamera ${label}`}>
    <header className="camera-header"><div><h2 ref={heading} tabIndex={-1}>Foto {label}</h2><p>{photo ? "Pastikan seluruh ompreng terlihat jelas." : "Arahkan kamera dari atas ompreng."}</p></div><button type="button" className="camera-close" onClick={onClose}>Tutup</button></header>
    <div className={`camera-viewfinder ${photo ? "has-photo" : ""}`}>
      {photo ? <img src={photo} alt={`Pratinjau ompreng ${label}`}/> : <video ref={video} autoPlay muted playsInline aria-label="Pratinjau kamera belakang"/>}
      {!photo && <><div className="camera-frame" aria-hidden="true"><i/><i/><i/><i/></div><span className="camera-frame-caption">Posisikan seluruh ompreng di dalam bingkai</span>{status !== "ready" && <div className="camera-state" role="status"><Icon name="camera" size={40}/><p>{status === "starting" ? "Menyiapkan kamera…" : "Pilih galeri atau coba kamera lagi"}</p></div>}</>}
    </div>
    {error && <p className="camera-error" role="alert">{error}</p>}
    <div className="camera-controls">{photo ? <><button type="button" className="btn camera-secondary" onClick={() => { setPhoto(undefined); setError(""); }}>Foto ulang</button><button type="button" className="btn btn-sun" disabled={reading} onClick={() => onUse(photo)}>Gunakan foto<Icon name="check" size={18}/></button></> : <>
      <label className={`camera-gallery ${reading ? "is-disabled" : ""}`}><Icon name="upload" size={22}/><span>{reading ? "Memproses…" : "Galeri"}</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={reading} aria-label={`Pilih foto ${label} dari galeri`} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }}/></label>
      <button type="button" className="camera-shutter" disabled={status !== "ready" || reading} onClick={capture} aria-label={`Ambil foto ${label}`}><span/></button>
      <div className="camera-control-note">{status === "error" ? <button type="button" onClick={() => setAttempt(value => value + 1)}>Coba kamera lagi</button> : <span>Ketuk untuk<br/>ambil foto</span>}</div>
    </>}</div><p className="camera-footnote">{photo ? "Foto akan disimpan setelah kamu memilih Gunakan foto." : "Bingkai membantu posisi foto. Hasil pengamatan diproses setelah kedua foto lengkap."}</p>
  </section>;
}
