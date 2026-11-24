export const INTRO_REPLAY_EVENT = "tuntas:replay-intro";

let replayRequested = false;

/** Dipanggil oleh tautan logo: minta beranda gulir ke atas dan memutar ulang intro Porsi. */
export function requestIntroReplay() {
  replayRequested = true;
  window.dispatchEvent(new Event(INTRO_REPLAY_EVENT));
}

/** True sekali per permintaan, sehingga kembali lewat tombol back tidak memutar ulang intro. */
export function consumeIntroReplay() {
  const requested = replayRequested;
  replayRequested = false;
  return requested;
}
