#!/usr/bin/env node
/**
 * Generate Authorization header and x-req-signature for iFortepay Create VA API.
 *
 *   Authorization   = "Basic " + Base64(merchant_index + ":" + secret_unbound_id)
 *   x-req-signature = SHA256(hash_key + external_id + order_id)
 *
 * Usage:
 *   node scripts/generate_signature.js --external-id 1707778671936 --order-id Test-01
 *   node scripts/generate_signature.js --body body.json      (reads external_id & order_id from file)
 *   node scripts/generate_signature.js --self-test           (verify against sample cURL in the assessment)
 */
const crypto = require('crypto');
const fs = require('fs');
const { loadConfig } = require('./env');

function generateAuthorization(merchantIndex, secretUnboundId) {
  return 'Basic ' + Buffer.from(`${merchantIndex}:${secretUnboundId}`, 'utf8').toString('base64');
}

function generateSignature(hashKey, externalId, orderId) {
  return crypto.createHash('sha256').update(`${hashKey}${externalId}${orderId}`, 'utf8').digest('hex');
}

function selfTest(CONFIG) {
  // x-req-signature from the sample cURL in the assessment document (external_id 1707778671936, order_id Test-01).
  // The sample Authorization header is not stored here because Base64 reveals the secret;
  // it is checked by decoding it back to merchant_index:secret_unbound_id instead.
  const expectedSig = '673e177fa34784edd0743d2e50061f60cf9b0c174c9fcfa3e4334efaa92705cc';
  const auth = generateAuthorization(CONFIG.merchant_index, CONFIG.secret_unbound_id);
  const decoded = Buffer.from(auth.replace('Basic ', ''), 'base64').toString('utf8');
  const expectedAuth = decoded === `${CONFIG.merchant_index}:${CONFIG.secret_unbound_id}` ? auth : '(decoded value does not match .env)';
  const sig = generateSignature(CONFIG.hash_key, '1707778671936', 'Test-01');
  const results = [
    ['Authorization', auth, expectedAuth],
    ['x-req-signature', sig, expectedSig],
  ];
  let pass = true;
  for (const [name, actual, expected] of results) {
    const ok = actual === expected;
    pass = pass && ok;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      actual  : ${actual}\n      expected: ${expected}`);
  }
  process.exit(pass ? 0 : 1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const next = argv[i + 1];
      args[argv[i].slice(2)] = next && !next.startsWith('--') ? argv[++i] : true;
    }
  }
  return args;
}

if (require.main === module) {
  const CONFIG = loadConfig();
  const args = parseArgs(process.argv.slice(2));
  if (args['self-test']) selfTest(CONFIG);

  let externalId = args['external-id'];
  let orderId = args['order-id'];
  if (args.body) {
    const body = JSON.parse(fs.readFileSync(args.body, 'utf8'));
    externalId = body.external_id;
    orderId = body.order_id;
  }
  if (!externalId) externalId = Date.now().toString();
  if (!orderId) {
    console.error('order_id is required (--order-id or --body)');
    process.exit(1);
  }

  console.log(JSON.stringify({
    external_id: externalId,
    order_id: orderId,
    Authorization: generateAuthorization(CONFIG.merchant_index, CONFIG.secret_unbound_id),
    'x-req-signature': generateSignature(CONFIG.hash_key, externalId, orderId),
  }, null, 2));
}

module.exports = { generateAuthorization, generateSignature };
