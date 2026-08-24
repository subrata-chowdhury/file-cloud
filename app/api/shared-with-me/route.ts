import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20;
    const offset = (page - 1) * limit;

    // We join FileShare with File and User (to get owner name)
    // Only return files that are not trashed!
    const sharedFilesRes = await query(
      `SELECT f.*, u.name as "ownerName", u.email as "ownerEmail", fs."sharedAt"
       FROM "FileShare" fs
       JOIN "File" f ON fs."fileId" = f.id
       JOIN "User" u ON f."ownerId" = u.id
       WHERE fs."userId" = $1 AND f."isTrashed" = false
       ORDER BY fs."sharedAt" DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return NextResponse.json(sharedFilesRes.rows);
  } catch (error) {
    console.error('Fetch shared with me error:', error);
    return NextResponse.json({ error: 'Failed to fetch shared files' }, { status: 500 });
  }
}
