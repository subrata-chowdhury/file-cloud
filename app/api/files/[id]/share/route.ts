import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { randomUUID } from 'crypto';

// GET list of users this file is shared with
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: fileId } = await context.params;

    // Check if the file exists and is owned by the user
    const fileRes = await query('SELECT "ownerId" FROM "File" WHERE id = $1', [fileId]);
    if (fileRes.rowCount === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Allow if they are the owner
    const isOwner = fileRes.rows[0].ownerId === userId;
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sharedUsersRes = await query(
      `SELECT u.id, u.name, u.email, fs."sharedAt" 
       FROM "FileShare" fs 
       JOIN "User" u ON fs."userId" = u.id 
       WHERE fs."fileId" = $1
       ORDER BY fs."sharedAt" DESC`,
      [fileId]
    );

    return NextResponse.json(sharedUsersRes.rows);
  } catch (error) {
    console.error('Fetch shared users error:', error);
    return NextResponse.json({ error: 'Failed to fetch shared users' }, { status: 500 });
  }
}

// POST share file with a user
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const currentUserId = getUserIdFromRequest(req);
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: fileId } = await context.params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Verify ownership
    const fileRes = await query('SELECT "ownerId" FROM "File" WHERE id = $1', [fileId]);
    if (fileRes.rowCount === 0 || fileRes.rows[0].ownerId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden or not found' }, { status: 403 });
    }

    // Insert ignore/on conflict
    const shareId = randomUUID();
    await query(
      `INSERT INTO "FileShare" (id, "fileId", "userId") 
       VALUES ($1, $2, $3) 
       ON CONFLICT ("fileId", "userId") DO NOTHING`,
      [shareId, fileId, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Share file error:', error);
    return NextResponse.json({ error: 'Failed to share file' }, { status: 500 });
  }
}

// DELETE remove share for a user
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const currentUserId = getUserIdFromRequest(req);
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: fileId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Verify ownership
    const fileRes = await query('SELECT "ownerId" FROM "File" WHERE id = $1', [fileId]);
    if (fileRes.rowCount === 0 || fileRes.rows[0].ownerId !== currentUserId) {
      return NextResponse.json({ error: 'Forbidden or not found' }, { status: 403 });
    }

    await query(`DELETE FROM "FileShare" WHERE "fileId" = $1 AND "userId" = $2`, [fileId, userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unshare file error:', error);
    return NextResponse.json({ error: 'Failed to unshare file' }, { status: 500 });
  }
}
