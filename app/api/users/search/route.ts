import { NextResponse, NextRequest } from 'next/server';
import { db, query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.trim() === '') {
      return NextResponse.json([]);
    }

    const searchStr = `%${q.trim()}%`;

    const result = await query(
      `SELECT id, name, email FROM "User" 
       WHERE id != $1 AND (email ILIKE $2 OR name ILIKE $2)
       ORDER BY name ASC, email ASC
       LIMIT 10`,
      [userId, searchStr]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}
