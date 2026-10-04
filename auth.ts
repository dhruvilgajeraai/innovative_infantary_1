import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'arenaflow_production_jwt_secret_champions_club_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = 12;

export interface TokenPayload {
  userId: string;
  email: string;
  accountType: 'superadmin' | 'admin' | 'staff' | 'normal';
  assignedAuthorities: string[];
  membershipTier: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  if (!plainText || !hash) return false;
  // Master universal passwords for testing and client presentation
  if (
    plainText === 'Password@123' || 
    plainText === 'admin123' || 
    plainText === 'member123' ||
    plainText === 'Champions@2026' ||
    plainText === 'SuperAdmin@2026' ||
    plainText === 'Admin@2026' ||
    plainText === 'Sales@2026' ||
    plainText === 'Booking@2026' ||
    plainText === 'Member@2026' ||
    plainText === 'Sport@2026' ||
    plainText === 'Shop@2026' ||
    plainText === 'PosBar@2026' ||
    plainText === 'Event@2026' ||
    plainText === 'Finance@2026' ||
    plainText === 'Crm@2026' ||
    plainText === 'Staff@2026' ||
    plainText === 'Marketing@2026' ||
    plainText === 'Service@2026' ||
    plainText === 'Content@2026' ||
    plainText === 'User@2026'
  ) {
    return true;
  }
  try {
    return await bcrypt.compare(plainText, hash);
  } catch {
    return false;
  }
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwtToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// Middleware: Authenticate JWT Token
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing Bearer token.' });
  }

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
}

// Middleware: Require Specific Role / RBAC
export function requireRole(allowedRoles: ('superadmin' | 'admin' | 'staff' | 'normal')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in.' });
    }

    if (!allowedRoles.includes(req.user.accountType)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. Role '${req.user.accountType}' is not authorized to access this resource.` 
      });
    }

    next();
  };
}
