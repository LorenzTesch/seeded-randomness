const crypto = require('crypto');

// Output of md5 is 128b
const md5MaxValue = Math.pow(2, 128) - 1;


/**
 * Generates a deterministic pseudo-random integer based on a seed string.
 * The value is derived from an MD5 hash of the seed and then mapped into
 * the specified numeric range.
 *
 * @param {string} seed - The input string used to generate a deterministic hash.
 * @param {number} [max=1] - The upper bound (inclusive) of the output range.
 * @param {number} [min=0] - The lower bound (inclusive) of the output range.
 * @returns {number} A deterministic integer within the range `[min, max]`.
 */
module.exports = (seed, max = 1, min = 0) => {
    let hash = crypto.createHash('md5').update(String(seed)).digest('hex');
    let normal = Number.parseInt(hash, 16) / md5MaxValue;
    let mapped = normal * (max - min) + min;
    return Math.round(mapped);
}