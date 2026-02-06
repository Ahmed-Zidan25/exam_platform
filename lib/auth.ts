import crypto from 'crypto'

const ALGORITHM = 'sha256'

export function hashPassword(password: string): string {
  return crypto.createHash(ALGORITHM).update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
