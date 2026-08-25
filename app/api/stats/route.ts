import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await query(
      `SELECT COUNT(id) as "totalFiles", COALESCE(SUM(size), 0) as "totalBytes", COALESCE(SUM(views), 0) as "totalViews" FROM "File" WHERE "ownerId" = $1 AND "isTrashed" = false`,
      [userId]
    );

    const { rows: folderRows } = await query(
      `SELECT COUNT(id) as "totalFolders" FROM "Folder" WHERE "ownerId" = $1 AND "isTrashed" = false`,
      [userId]
    );

    const stats = {
      totalFiles: parseInt(rows[0].totalFiles, 10),
      totalBytes: parseInt(rows[0].totalBytes, 10),
      totalViews: parseInt(rows[0].totalViews, 10),
      totalFolders: parseInt(folderRows[0].totalFolders, 10),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
