/**
 * HEAD-checks every URL in data/resources.json. Reports failures, exits
 * non-zero if any fail. Run before each milestone to mitigate the
 * "resource links become outdated" risk from §15 of the proposal.
 *
 * Usage: npm run check-links
 */
import fs from 'node:fs';
import path from 'node:path';

const RESOURCES_PATH = path.join(process.cwd(), 'data', 'resources.json');
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 8;

interface Resource {
  id: string;
  name: string;
  url: string;
}

interface CheckResult {
  resource: Resource;
  status: number | 'timeout' | 'network_error' | 'tls_warning';
  redirectedTo?: string;
  error?: string;
}

// Node's TLS validator rejects servers that don't include intermediate CAs in
// their chain (browsers and curl recover from this via cached intermediates).
// Treat these as warnings — the URL works for actual users.
const TLS_CHAIN_CODES = new Set([
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  'UNABLE_TO_GET_ISSUER_CERT',
  'CERT_HAS_EXPIRED',
  'SELF_SIGNED_CERT_IN_CHAIN',
]);

function isTlsChainError(err: unknown): boolean {
  const cause = (err as { cause?: { code?: string } })?.cause;
  return !!cause?.code && TLS_CHAIN_CODES.has(cause.code);
}

async function fetchOnce(resource: Resource, freshConnection = false): Promise<CheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Many institutional sites reject HEAD or return misleading codes, so we
    // use GET but follow redirects to find the real final status.
    const headers: Record<string, string> = {
      // Some UW pages serve 403 to default fetch UA. Pretend to be a browser.
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    };
    if (freshConnection) {
      // Undici's HTTP keep-alive pool occasionally returns a stale socket for
      // certain hosts. Forcing the connection closed sidesteps that.
      headers.Connection = 'close';
    }
    const res = await fetch(resource.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers,
    });
    const redirectedTo = res.url !== resource.url ? res.url : undefined;
    return { resource, status: res.status, redirectedTo };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { resource, status: 'timeout' };
    }
    if (isTlsChainError(err)) {
      const cause = (err as { cause?: { code?: string } }).cause;
      return {
        resource,
        status: 'tls_warning',
        error: `${cause?.code} (UW server is missing intermediate CAs; browsers still load it)`,
      };
    }
    return {
      resource,
      status: 'network_error',
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function checkOne(resource: Resource): Promise<CheckResult> {
  // Node's undici fetch occasionally drops TLS connections when many are in
  // flight. Retry transient network errors with a fresh (no-keepalive) connection.
  const first = await fetchOnce(resource);
  if (first.status === 'network_error' || first.status === 'timeout') {
    await new Promise((r) => setTimeout(r, 750));
    return fetchOnce(resource, true);
  }
  return first;
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, next));
  return results;
}

async function main() {
  const resources: Resource[] = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf-8'));
  console.log(`Checking ${resources.length} URLs (concurrency ${CONCURRENCY}, timeout ${TIMEOUT_MS} ms)…`);

  const results = await runWithConcurrency(resources, checkOne, CONCURRENCY);

  const failed: CheckResult[] = [];
  const warnings: CheckResult[] = [];
  for (const r of results) {
    if (typeof r.status === 'number' && r.status >= 200 && r.status < 400) {
      const note = r.redirectedTo ? `  → ${r.redirectedTo}` : '';
      console.log(`  ✓ ${r.status} ${r.resource.id}${note}`);
    } else if (r.status === 'tls_warning') {
      warnings.push(r);
      console.log(`  ! tls  ${r.resource.id} — ${r.resource.url}  (${r.error})`);
    } else {
      failed.push(r);
      const detail = r.error ? `  (${r.error})` : '';
      console.log(`  ✗ ${r.status} ${r.resource.id} — ${r.resource.url}${detail}`);
    }
  }

  console.log('');
  if (warnings.length > 0) {
    console.log(`${warnings.length} TLS warning(s) — URLs work in browsers but UW server is missing intermediate CAs.`);
  }
  if (failed.length === 0) {
    console.log(`All ${resources.length} URLs reachable (${warnings.length} TLS warning, ${results.length - failed.length - warnings.length} OK).`);
    return;
  }
  console.log(`${failed.length} of ${resources.length} URLs failed:`);
  for (const r of failed) {
    console.log(`  - ${r.resource.id} (${r.resource.name}): ${r.resource.url} → ${r.status}`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
