/**
 * Generates a verification hash for a student's certificate.
 * Includes studentId, schoolId, rollNo, and issuance date to produce a unique hash.
 */
export function generateCertificateHash(
  studentId: string,
  schoolId: string,
  rollNo: string,
  issueDate?: string
): string {
  const dateStr = issueDate || new Date().toISOString().split('T')[0];
  const payload = `${studentId}:${schoolId}:${rollNo}:${dateStr}:arkashine-tamperproof-salt`;
  
  // Deterministic 32-bit hash converted to hex
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hexCode = Math.abs(hash).toString(16).padStart(8, '0');
  const cleanRoll = rollNo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const cleanSchool = schoolId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  return `ark-sil-${cleanSchool}-${cleanRoll}-${hexCode}`;
}

/**
 * Validates a certificate verification hash format.
 */
export function isValidHashFormat(hash: string): boolean {
  if (!hash) return false;
  return /^ark-sil-[a-z0-9]+-[a-z0-9]+-[a-f0-9]{8}$/i.test(hash.trim());
}
