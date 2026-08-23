import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { rows: existingUsers } = await query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = randomUUID();

    const { rows: newUsers } = await query(
      `INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
      [id, email, hashedPassword, name]
    );
    const user = newUsers[0];

    const token = signToken(user.id);

    const response = NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
