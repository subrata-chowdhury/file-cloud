import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { rows: files } = await query(
      `SELECT * FROM "File" WHERE "ownerId" = $1 AND "isTrashed" = true ORDER BY "updatedAt" DESC`,
      [userId]
    );
    const { rows: folders } = await query(
      `SELECT * FROM "Folder" WHERE "ownerId" = $1 AND "isTrashed" = true ORDER BY "updatedAt" DESC`,
      [userId]
    );

    return NextResponse.json({ files, folders });
  } catch (error) {
    console.error('Fetch trash error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
