/**
 * Client-side only. Produces a stable-per-browser identifier by combining a
 * few low-entropy signals (not full canvas/WebGL fingerprinting — a
 * lightweight CMS's device-trust feature doesn't need to survive a
 * determined adversary, just recognize "this is the same phone as last
 * time" well enough to skip re-approval) with a random value generated
 * once and persisted in localStorage, so the fingerprint is stable across
 * logins on the same browser even if low-entropy signals alone would
 * collide across similar devices.
 */
const STORAGE_KEY = "4b_device_fingerprint_seed";

function getOrCreateSeed(): string {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const seed = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, seed);
    return seed;
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall back to a
    // session-only value; the device will simply need re-approval next visit.
    return crypto.randomUUID();
  }
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeDeviceFingerprint(): Promise<string> {
  const seed = getOrCreateSeed();
  const signals = [
    seed,
    navigator.userAgent,
    String(screen.width),
    String(screen.height),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
  ].join("|");
  return sha256(signals);
}

export function guessDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? "Android Phone" : "Android Tablet";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Macintosh/.test(ua)) return "Mac";
  return "جهاز غير معروف";
}
