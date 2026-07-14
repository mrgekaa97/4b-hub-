/**
 * Deliberately not pulling in a UA-parsing library for two labels — this
 * covers the common cases well enough for "which phone did this guard log
 * in from" admin-approval purposes. If real accuracy becomes important
 * (V2), swap this for `ua-parser-js` without changing any call site, since
 * both callers only depend on the { browser, operatingSystem } shape.
 */
export function parseUserAgent(userAgent: string): { browser: string; operatingSystem: string } {
  const ua = userAgent || "";

  let browser = "غير معروف";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/Chromium\//.test(ua)) browser = "Chromium";

  let operatingSystem = "غير معروف";
  if (/Android/.test(ua)) operatingSystem = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) operatingSystem = "iOS";
  else if (/Windows/.test(ua)) operatingSystem = "Windows";
  else if (/Macintosh|Mac OS/.test(ua)) operatingSystem = "macOS";
  else if (/Linux/.test(ua)) operatingSystem = "Linux";

  return { browser, operatingSystem };
}
