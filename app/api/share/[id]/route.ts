import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const fileId = params.id;
    const userId = getUserIdFromRequest(req);

    const { rows } = await query(
      `SELECT f.*, u.name as "ownerName", u.email as "ownerEmail" 
       FROM "File" f 
       JOIN "User" u ON f."ownerId" = u.id 
       WHERE f.id = $1 AND f."isTrashed" = false`,
      [fileId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileRow = rows[0];

    if (!fileRow.isPublic) {
      return NextResponse.json({ error: 'This file is private' }, { status: 403 });
    }

    let currentViews = fileRow.views || 0;

    // Increment views if the viewer is not the owner
    if (userId !== fileRow.ownerId) {
      await query(`UPDATE "File" SET views = COALESCE(views, 0) + 1 WHERE id = $1`, [fileId]);
      currentViews += 1;
    }

    // Restructure to match expected owner object
    const file = {
      ...fileRow,
      views: currentViews,
      downloads: fileRow.downloads || 0,
      owner: { name: fileRow.ownerName, email: fileRow.ownerEmail },
    };
    delete file.ownerName;
    delete file.ownerEmail;

    return NextResponse.json(file);
  } catch (error) {
    console.error('Fetch shared file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
