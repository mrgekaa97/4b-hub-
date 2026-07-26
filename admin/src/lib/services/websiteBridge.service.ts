/**
 * The Bridge — website/ is a separately-deployed static site (its own
 * Vercel project, no database, no server). This is the one place that
 * knows how to tell it "your content changed, rebuild yourself."
 *
 * Set WEBSITE_DEPLOY_HOOK_URL in .env to the website Vercel project's
 * Deploy Hook URL (Vercel project → Settings → Git → Deploy Hooks).
 * Website's build step (website/build.py) is responsible for actually
 * fetching fresh content from /api/public/* at build time — this module
 * only fires the "please rebuild now" signal.
 *
 * Deliberately fire-and-forget with a short timeout: a failed/slow
 * deploy-hook call should never block or fail the admin's publish action
 * itself — worst case, the admin republishes or the site catches up on
 * its next natural deploy.
 */
export async function triggerWebsiteRebuild(reason: string): Promise<void> {
  const hookUrl = process.env.WEBSITE_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    console.warn(`[website-bridge] WEBSITE_DEPLOY_HOOK_URL not set — skipping rebuild trigger (reason: ${reason})`);
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(hookUrl, { method: "POST", signal: controller.signal });
    clearTimeout(timeout);

    // fetch() only throws on network-level failures — a 4xx/5xx response
    // from Vercel (wrong/expired hook URL, auth issue, etc.) resolves
    // normally and would otherwise be silently treated as success. Checking
    // response.ok explicitly is what makes a bad hook URL diagnosable from
    // logs instead of just "nothing happens and no one knows why."
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        `[website-bridge] Deploy hook responded with ${res.status} ${res.statusText} (reason: ${reason}). Body: ${body.slice(0, 300)}`
      );
      return;
    }

    console.log(`[website-bridge] Website rebuild triggered successfully (reason: ${reason}, status: ${res.status})`);
  } catch (err) {
    console.error(`[website-bridge] Failed to trigger website rebuild (reason: ${reason}):`, err);
  }
}
