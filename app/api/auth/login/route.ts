import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { rows } = await query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const notificationId = randomUUID();
    const loginTime = new Date().toLocaleTimeString();

    // Create a security notification on login
    await query(
      `INSERT INTO "Notification" (id, "userId", title, message, type, severity, "isRead")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        notificationId,
        user.id,
        'New Login Detected',
        `A new login to your account was detected at ${loginTime}.`,
        'Security',
        'high',
        false,
      ]
    );

    const token = signToken(user.id);

    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
