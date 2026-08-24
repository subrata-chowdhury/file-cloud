import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const fileId = params.id;

    const { rowCount } = await query(
      'UPDATE "File" SET "isTrashed" = false, "updatedAt" = NOW() WHERE id = $1 AND "ownerId" = $2',
      [fileId, userId]
    );
    if (rowCount === 0) return NextResponse.json({ error: 'File not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Restore file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const fileId = params.id;

    const { rows } = await query('SELECT "publicId" FROM "File" WHERE id = $1 AND "ownerId" = $2', [
      fileId,
      userId,
    ]);
    const file = rows[0];
    if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 });

    await cloudinary.uploader.destroy(file.publicId).catch(console.error);
    await query('DELETE FROM "File" WHERE id = $1', [fileId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hard delete file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
