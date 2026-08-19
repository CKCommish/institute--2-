import { chromium } from 'playwright';
export const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/* The proxy port is assigned per session and changes on restart — never hardcode it. */
export const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || '';
/* The session egress proxy re-terminates TLS and rejects Chrome's TLS 1.3
   ClientHello, so browser traffic is pinned to TLS 1.2 through the proxy.
   Local (127.0.0.1) traffic bypasses the proxy entirely. */
export async function launch({ proxy = true, ...opts } = {}) {
  return chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--ssl-version-max=tls1.2',
           '--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none'],
    ...(proxy && PROXY ? { proxy: { server: PROXY } } : {}),
    ...opts,
  });
}
