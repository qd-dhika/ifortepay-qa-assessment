/**
 * Load credentials from .env (see .env.example) and fail fast when one is missing.
 */
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const REQUIRED = ['BASE_URL', 'MERCHANT_INDEX', 'SECRET_UNBOUND_ID', 'HASH_KEY'];

function loadConfig() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing env: ${missing.join(', ')}. Copy .env.example to .env and fill in the credentials.`,
    );
  }
  return {
    base_url: process.env.BASE_URL,
    merchant_index: process.env.MERCHANT_INDEX,
    secret_unbound_id: process.env.SECRET_UNBOUND_ID,
    hash_key: process.env.HASH_KEY,
    x_version: process.env.X_VERSION || 'v3',
  };
}

module.exports = { loadConfig };
