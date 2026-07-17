/**
 * Script de test complet de l'API — Auth + RBAC
 * Usage: node test-api.js
 */
const http = require('http');

const BASE = 'http://localhost:3000/api';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function log(label, expected, actual, pass) {
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} ${label} — expected ${expected}, got ${actual}`);
  if (!pass) console.log('   FAILED!');
}

async function run() {
  console.log('========================================');
  console.log('  API TEST SUITE — Auth + RBAC');
  console.log('========================================\n');

  let passed = 0, failed = 0;
  function check(label, expected, actual) {
    const pass = expected === actual;
    log(label, expected, actual, pass);
    pass ? passed++ : failed++;
  }

  // 1. Login — public
  console.log('--- LOGIN ---');
  const loginRes = await request('POST', '/auth/login', { email: 'admin@reftech.com', password: 'admin123' });
  check('Login admin', 200, loginRes.status);
  const adminToken = loginRes.body.token;

  // Check password not in response
  const hasNoPassword = !loginRes.body.user?.password;
  check('Password not in login response', true, hasNoPassword);

  // 2. Login with wrong password
  const badLogin = await request('POST', '/auth/login', { email: 'admin@reftech.com', password: 'wrong' });
  check('Login wrong password → 401', 401, badLogin.status);

  // 3. GET /auth/me — protected
  console.log('\n--- AUTH/ME ---');
  const meRes = await request('GET', '/auth/me', null, adminToken);
  check('GET /auth/me with token', 200, meRes.status);
  check('Password not in /me response', true, !meRes.body.user?.password);

  const meNoToken = await request('GET', '/auth/me', null, null);
  check('GET /auth/me without token → 401', 401, meNoToken.status);

  // 4. Register a commissaire (admin only)
  console.log('\n--- REGISTER ---');
  const regRes = await request('POST', '/auth/register', {
    nom: 'Test Commissaire', email: 'comm@test.com', password: 'test123', role: 'commissaire'
  }, adminToken);
  check('Register commissaire (as admin)', 201, regRes.status);

  // Login as commissaire
  const commLogin = await request('POST', '/auth/login', { email: 'comm@test.com', password: 'test123' });
  check('Login commissaire', 200, commLogin.status);
  const commToken = commLogin.body.token;

  // Register as consultation user
  const regConsult = await request('POST', '/auth/register', {
    nom: 'Test Consultation', email: 'consult@test.com', password: 'test123', role: 'consultation'
  }, adminToken);
  check('Register consultation (as admin)', 201, regConsult.status);
  const consultLogin = await request('POST', '/auth/login', { email: 'consult@test.com', password: 'test123' });
  const consultToken = consultLogin.body.token;

  // Register as arbitre user
  const regArbitre = await request('POST', '/auth/register', {
    nom: 'Test Arbitre', email: 'arb@test.com', password: 'test123', role: 'arbitre'
  }, adminToken);
  check('Register arbitre (as admin)', 201, regArbitre.status);
  const arbLogin = await request('POST', '/auth/login', { email: 'arb@test.com', password: 'test123' });
  const arbToken = arbLogin.body.token;

  // 5. Register forbidden for non-admin
  const regForbidden = await request('POST', '/auth/register', {
    nom: 'Hack', email: 'hack@test.com', password: 'hack123', role: 'admin'
  }, commToken);
  check('Register as commissaire → 403', 403, regForbidden.status);

  // 6. ARBITRES CRUD
  console.log('\n--- ARBITRES ---');

  // GET /arbitres — all roles
  const getArb = await request('GET', '/arbitres', null, consultToken);
  check('GET /arbitres (consultation)', 200, getArb.status);

  // POST /arbitres — admin + commissaire
  const newArb = await request('POST', '/arbitres', {
    nom: 'Test', prenom: 'Ref', nationalite: 'France', confederation: 'UEFA', categorie: 'Central'
  }, commToken);
  check('POST /arbitres (commissaire)', 201, newArb.status);
  const arbId = newArb.body.id;

  const newArbForbid = await request('POST', '/arbitres', {
    nom: 'X', prenom: 'Y', nationalite: 'France', confederation: 'UEFA', categorie: 'Central'
  }, consultToken);
  check('POST /arbitres (consultation) → 403', 403, newArbForbid.status);

  // PUT /arbitres — admin + commissaire
  const putArb = await request('PUT', '/arbitres/' + arbId, { nom: 'Updated' }, commToken);
  check('PUT /arbitres (commissaire)', 200, putArb.status);

  const putArbForbid = await request('PUT', '/arbitres/' + arbId, { nom: 'Hack' }, arbToken);
  check('PUT /arbitres (arbitre) → 403', 403, putArbForbid.status);

  // DELETE /arbitres — admin only
  const delArbForbid = await request('DELETE', '/arbitres/' + arbId, null, commToken);
  check('DELETE /arbitres (commissaire) → 403', 403, delArbForbid.status);

  const delArb = await request('DELETE', '/arbitres/' + arbId, null, adminToken);
  check('DELETE /arbitres (admin)', 200, delArb.status);

  // 7. No token at all → 401
  console.log('\n--- 401 TESTS ---');
  const noToken1 = await request('GET', '/arbitres', null, null);
  check('GET /arbitres without token → 401', 401, noToken1.status);

  const noToken2 = await request('POST', '/matchs', { equipeDomicile: 'A', equipeExterieur: 'B', stade: 'S', villeHote: 'V', dateMatch: '2026-06-01', phase: 'Groupes' }, null);
  check('POST /matchs without token → 401', 401, noToken2.status);

  // Invalid token
  const badToken = await request('GET', '/arbitres', null, 'invalid.token.here');
  check('GET /arbitres with bad token → 401', 401, badToken.status);

  // 8. MATCHS
  console.log('\n--- MATCHS ---');
  const newMatch = await request('POST', '/matchs', {
    equipeDomicile: 'France', equipeExterieur: 'Brésil', stade: 'MetLife', villeHote: 'New York', dateMatch: '2026-07-19', phase: 'finale'
  }, adminToken);
  check('POST /matchs (admin)', 201, newMatch.status);

  const getMatch = await request('GET', '/matchs', null, arbToken);
  check('GET /matchs (arbitre)', 200, getMatch.status);

  // 9. Summary
  console.log('\n========================================');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================');

  // Cleanup test users
  const {User, sequelize} = require('./models/index');
  await User.destroy({ where: { email: ['comm@test.com', 'consult@test.com', 'arb@test.com'] } });
  console.log('\nTest users cleaned up.');
  
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Test error:', e); process.exit(1); });
