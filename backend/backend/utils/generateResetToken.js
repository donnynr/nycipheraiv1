const crypto = require('crypto');

function generateResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 3600000; // 1 hour
  return { token, expiry };
}

module.exports = generateResetToken;