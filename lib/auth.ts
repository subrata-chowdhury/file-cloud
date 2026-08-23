import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      return { userId: String(decoded.userId) };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getUserIdFromRequest = (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};
