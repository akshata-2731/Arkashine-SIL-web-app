import { describe, it, expect } from 'vitest';
import { generateCertificateHash, isValidHashFormat } from '../certificateUtils';

describe('certificateUtils', () => {
  it('generates a deterministic certificate hash matching the required format', () => {
    const hash1 = generateCertificateHash('STU-01', 'SCH-01', 'B-101', '2026-06-20');
    const hash2 = generateCertificateHash('STU-01', 'SCH-01', 'B-101', '2026-06-20');

    expect(hash1).toBe(hash2);
    expect(hash1.startsWith('ark-sil-sch01-b101-')).toBe(true);
    expect(isValidHashFormat(hash1)).toBe(true);
  });

  it('generates different hashes for different students or dates', () => {
    const hashA = generateCertificateHash('STU-01', 'SCH-01', 'B-101', '2026-06-20');
    const hashB = generateCertificateHash('STU-02', 'SCH-01', 'B-102', '2026-06-20');
    const hashC = generateCertificateHash('STU-01', 'SCH-01', 'B-101', '2026-06-21');

    expect(hashA).not.toBe(hashB);
    expect(hashA).not.toBe(hashC);
  });

  it('validates hash formats correctly', () => {
    expect(isValidHashFormat('ark-sil-sch01-101-a1b2c3d4')).toBe(true);
    expect(isValidHashFormat('invalid-hash')).toBe(false);
    expect(isValidHashFormat('')).toBe(false);
    expect(isValidHashFormat('ark-sil-sch01-101')).toBe(false); // missing 8-hex suffix
  });
});
