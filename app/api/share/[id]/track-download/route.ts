import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const fileId = params.id;
    const userId = getUserIdFromRequest(req);

    const { rows } = await query(
      `SELECT "ownerId" FROM "File" WHERE id = $1 AND "isTrashed" = false`,
      [fileId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileRow = rows[0];

    // Increment downloads if the downloader is not the owner
    if (userId !== fileRow.ownerId) {
      await query(`UPDATE "File" SET downloads = COALESCE(downloads, 0) + 1 WHERE id = $1`, [
        fileId,
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
