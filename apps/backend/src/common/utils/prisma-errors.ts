import { Prisma } from '@prisma/client';

/**
 * Type guard to check if an error is a Prisma Known Request Error
 */
export function isPrismaError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    (typeof error === 'object' && error !== null && 'code' in error)
  );
}

/**
 * Check if an error is a Prisma unique constraint violation (P2002).
 */
export function isUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError & { code: 'P2002' } {
  return isPrismaError(error) && error.code === 'P2002';
}

/**
 * Check if an error is a Prisma foreign key constraint violation (P2003).
 */
export function isForeignKeyError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError & { code: 'P2003' } {
  return isPrismaError(error) && error.code === 'P2003';
}

/**
 * Check if an error is a Prisma "record not found" error (P2025).
 */
export function isNotFoundError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError & { code: 'P2025' } {
  return isPrismaError(error) && error.code === 'P2025';
}
