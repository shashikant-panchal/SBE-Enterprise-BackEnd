const crypto = require('crypto');

/**
 * Generates a cryptographically strong password
 * @param {number} length - Desired length (default 16)
 * @returns {string} - Generated strong password
 */
function generateStrongPassword(length = 16) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*()_+-=[]{}|';
  const allChars = upper + lower + digits + symbols;

  // Guarantee at least one of each category
  const guaranteed = [
    upper[crypto.randomInt(0, upper.length)],
    lower[crypto.randomInt(0, lower.length)],
    digits[crypto.randomInt(0, digits.length)],
    symbols[crypto.randomInt(0, symbols.length)],
  ];

  const remainingLength = Math.max(length, 12) - guaranteed.length;
  const remaining = [];
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = crypto.randomInt(0, allChars.length);
    remaining.push(allChars[randomIndex]);
  }

  // Shuffle all characters
  const combined = [...guaranteed, ...remaining];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}

module.exports = { generateStrongPassword };
