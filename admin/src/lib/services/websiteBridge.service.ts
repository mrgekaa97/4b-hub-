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
    await fetch(hookUrl, { method: "POST", signal: controller.signal });
    clearTimeout(timeout);
  } catch (err) {
    console.error(`[website-bridge] Failed to trigger website rebuild (reason: ${reason}):`, err);
  }
}
