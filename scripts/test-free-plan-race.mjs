/**
 * Race test for POST /api/plan/free
 *
 * Usage (PowerShell):
 *   $env:BASE_URL="http://localhost:3000"
 *   $env:AUTH_TOKEN="<your jwt>"
 *   node scripts/test-free-plan-race.mjs
 */

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

if (!AUTH_TOKEN) {
  console.error('Missing AUTH_TOKEN env var');
  process.exit(1);
}

const N = Number(process.env.N || 20);

async function callOnce(i) {
  const res = await fetch(`${BASE_URL}/api/plan/free`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  return { i, status: res.status, body: json };
}

const results = await Promise.all(Array.from({ length: N }, (_, i) => callOnce(i)));
results.sort((a, b) => a.i - b.i);

const ok = results.filter((r) => r.status === 200);
const bad = results.filter((r) => r.status !== 200);

console.log(`BASE_URL=${BASE_URL}`);
console.log(`Requests=${N}`);
console.log(`200 OK=${ok.length}`);
console.log(`Non-200=${bad.length}`);

if (ok.length > 1) {
  console.error('FAILED: more than one request succeeded (race condition)');
  console.dir(ok, { depth: 5 });
  process.exit(2);
}

console.log('Sample success:', ok[0]?.body ?? null);
console.log('Sample failure:', bad[0]?.body ?? null);

