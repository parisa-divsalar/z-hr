import fs from 'fs';
import path from 'path';

const tryFetch = async (url, init) => {
  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { res, text, json };
};

const pickAccessTokenCookie = (setCookie) => {
  if (!setCookie) return null;
  const items = Array.isArray(setCookie) ? setCookie : [setCookie];
  const access = items.find((c) => String(c).toLowerCase().startsWith('accesstoken='));
  if (!access) return null;
  return String(access).split(';')[0]; // "accessToken=..."
};

const detectBaseUrl = async () => {
  const ports = [3000, 3001, 3002, 3003, 3004];
  for (const port of ports) {
    const base = `http://localhost:${port}`;
    try {
      const { res } = await tryFetch(`${base}/`, { method: 'GET' });
      if (res.ok) return base;
    } catch {
      // ignore
    }
  }
  throw new Error(`Could not detect dev server port (tried ${ports.join(', ')})`);
};

const repoRoot = path.resolve(process.cwd());
const dataDir = process.env.DATABASE_PATH ? path.dirname(process.env.DATABASE_PATH) : path.join(repoRoot, 'data');
const usersFile = path.join(dataDir, 'users.json');
const cvsFile = path.join(dataDir, 'cvs.json');

const main = async () => {
  const baseUrl = await detectBaseUrl();
  const ts = Date.now();
  const email = `verify.coins.${ts}@example.test`;
  const password = `P@ssw0rd-${ts}`;
  const requestId = `req_verify_${ts}`;
  const requestId2 = `req_verify_second_${ts}`;

  console.log('[verify] baseUrl:', baseUrl);
  console.log('[verify] email:', email);
  console.log('[verify] requestId:', requestId);

  // Register (free coins are assigned at creation)
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: 'Verify Coins User' }),
    });
    if (!res.ok) throw new Error(`[register] HTTP ${res.status}: ${text}`);
    if (!json?.data?.userId) throw new Error(`[register] unexpected response: ${text}`);
  }

  // Login (get cookie)
  let cookie = null;
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`[login] HTTP ${res.status}: ${text}`);
    const setCookie = res.headers.get('set-cookie');
    cookie = pickAccessTokenCookie(setCookie);
    if (!cookie) {
      // Some runtimes split Set-Cookie; try raw header access (node fetch usually merges).
      throw new Error(`[login] missing accessToken cookie. set-cookie: ${setCookie || '<none>'}`);
    }
    if (!json?.data?.token) throw new Error(`[login] unexpected response: ${text}`);
  }

  // users/me before CV
  let beforeCoin = null;
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/users/me`, {
      method: 'GET',
      headers: { Cookie: cookie },
    });
    if (!res.ok) throw new Error(`[users/me before] HTTP ${res.status}: ${text}`);
    beforeCoin = Number(json?.data?.coin ?? NaN);
    console.log('[verify] coin before CV:', beforeCoin);
  }

  // Create first CV via edit-cv (this is where coins are consumed)
  {
    const cvText = JSON.stringify({
      profile: { fullName: 'Verify Coins User', headline: 'Tester' },
      summary: 'Test',
      skills: ['Testing'],
    });
    const { res, json, text } = await tryFetch(`${baseUrl}/api/cv/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ requestId, cvText }),
    });
    if (!res.ok) throw new Error(`[cv/edit-cv] HTTP ${res.status}: ${text}`);
    if (!json?.requestId) throw new Error(`[cv/analyze] unexpected response: ${text}`);
  }

  // users/me after CV
  let afterCoin = null;
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/users/me`, {
      method: 'GET',
      headers: { Cookie: cookie },
    });
    if (!res.ok) throw new Error(`[users/me after] HTTP ${res.status}: ${text}`);
    afterCoin = Number(json?.data?.coin ?? NaN);
    console.log('[verify] coin after CV:', afterCoin);
  }

  // Login again (simulate second visit/session)
  let cookie2 = null;
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`[login #2] HTTP ${res.status}: ${text}`);
    const setCookie = res.headers.get('set-cookie');
    cookie2 = pickAccessTokenCookie(setCookie);
    if (!cookie2) throw new Error(`[login #2] missing accessToken cookie. set-cookie: ${setCookie || '<none>'}`);
    if (!json?.data?.token) throw new Error(`[login #2] unexpected response: ${text}`);
  }

  // users/me on second login should still be 0
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/users/me`, {
      method: 'GET',
      headers: { Cookie: cookie2 },
    });
    if (!res.ok) throw new Error(`[users/me second login] HTTP ${res.status}: ${text}`);
    const coin2 = Number(json?.data?.coin ?? NaN);
    console.log('[verify] coin on second login:', coin2);
    if (coin2 !== 0) throw new Error(`[assert] expected coin on second login = 0, got ${coin2}`);
  }

  // Free plan claim should be rejected on second attempt
  {
    const { res, json, text } = await tryFetch(`${baseUrl}/api/plan/free`, {
      method: 'POST',
      headers: { Cookie: cookie2 },
    });
    if (res.ok) {
      throw new Error(`[assert] expected /api/plan/free to fail (already used), got 200: ${text}`);
    }
    const err = String(json?.error ?? text ?? '').toLowerCase();
    console.log('[verify] /api/plan/free second attempt status:', res.status);
    if (!err.includes('already')) {
      throw new Error(`[assert] expected /api/plan/free error to mention already used, got: ${text}`);
    }
  }

  // Creating a second resume on Free should be blocked (needs upgrade)
  {
    const cvText = JSON.stringify({
      profile: { fullName: 'Verify Coins User', headline: 'Tester 2' },
      summary: 'Test 2',
      skills: ['Testing'],
    });
    const { res, text } = await tryFetch(`${baseUrl}/api/cv/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie2 },
      body: JSON.stringify({ requestId: requestId2, cvText }),
    });
    console.log('[verify] second CV attempt status:', res.status);
    if (res.status !== 403) throw new Error(`[assert] expected second CV attempt 403, got ${res.status}: ${text}`);
  }

  // Confirm in JSON DB file
  let fileCoin = null;
  let userId = null;
  {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const u = users.find((x) => String(x?.email ?? '').toLowerCase() === email.toLowerCase());
    if (!u) throw new Error(`[data/users.json] user not found by email`);
    userId = Number(u.id);
    fileCoin = Number(u.coin ?? NaN);
    console.log('[verify] data/users.json coin:', fileCoin);
  }

  // Cleanup test rows (best-effort)
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const nextUsers = users.filter((x) => String(x?.email ?? '').toLowerCase() !== email.toLowerCase());
    fs.writeFileSync(usersFile, JSON.stringify(nextUsers, null, 2), 'utf8');
  } catch {}

  try {
    const cvs = JSON.parse(fs.readFileSync(cvsFile, 'utf8'));
    const nextCvs = cvs.filter(
      (x) =>
        String(x?.request_id ?? '') !== requestId &&
        String(x?.request_id ?? '') !== requestId2 &&
        Number(x?.user_id) !== userId
    );
    fs.writeFileSync(cvsFile, JSON.stringify(nextCvs, null, 2), 'utf8');
  } catch {}

  // Assertions
  if (beforeCoin !== 6) {
    throw new Error(`[assert] expected coin before CV = 6, got ${beforeCoin}`);
  }
  if (afterCoin !== 0) {
    throw new Error(`[assert] expected coin after CV = 0, got ${afterCoin}`);
  }
  if (fileCoin !== 0) {
    throw new Error(`[assert] expected data/users.json coin = 0, got ${fileCoin}`);
  }

  console.log('[verify] OK: first CV consumed 6 coins; second login stayed 0; free-claim blocked; second resume blocked.');
};

main().catch((e) => {
  console.error(String(e?.stack || e?.message || e));
  process.exitCode = 1;
});

