/**
 * Generates a 256-bit (32-byte) random unified ID.
 * Uses cryptographically secure random number generation to minimize collision probability.
 * @returns {string} A 64-character hexadecimal string representing a 256-bit random ID.
 * @example
 * const unifiedId = generateUnifiedId();
 * // Returns: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
 */
export const generateUnifiedId = (): string => {
  // Generate 32 bytes (256 bits) of random data
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);

  // Convert to hexadecimal string
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};
