// src/lib/codeGenerator.ts
import crypto from 'crypto';

export function generateActivationCode(prefix: string = 'DSB', year: number = 2026): string {
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${year}-${randomPart}`;
}

export function generateBatchCodes(count: number, bookId: string, editionId: string, prefix: string = 'DSB') {
  const codes = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    codes.push({
      code: generateActivationCode(prefix, currentYear),
      bookId,
      editionId,
      status: 'AVAILABLE' as const,
    });
  }
  return codes;
}