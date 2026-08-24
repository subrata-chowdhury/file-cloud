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
    const folderId = params.id;

    // Restore the folder and all its contents
    const { rows: nestedFolders } = await query(
      `WITH RECURSIVE folder_tree AS (
         SELECT id FROM "Folder" WHERE id = $1 AND "ownerId" = $2
         UNION ALL
         SELECT f.id FROM "Folder" f
         INNER JOIN folder_tree ft ON f."parentId" = ft.id
       ) SELECT id FROM folder_tree`,
      [folderId, userId]
    );

    if (nestedFolders.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const folderIds = nestedFolders.map((f) => f.id);
    await query(
      `UPDATE "File" SET "isTrashed" = false, "updatedAt" = NOW() WHERE "folderId" = ANY($1::text[])`,
      [folderIds]
    );
    await query(
      `UPDATE "Folder" SET "isTrashed" = false, "updatedAt" = NOW() WHERE id = ANY($1::text[])`,
      [folderIds]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Restore folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const folderId = params.id;

    const { rows: nestedFolders } = await query(
      `WITH RECURSIVE folder_tree AS (
         SELECT id FROM "Folder" WHERE id = $1 AND "ownerId" = $2
         UNION ALL
         SELECT f.id FROM "Folder" f
         INNER JOIN folder_tree ft ON f."parentId" = ft.id
       ) SELECT id FROM folder_tree`,
      [folderId, userId]
    );

    if (nestedFolders.length === 0)
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    const folderIds = nestedFolders.map((f) => f.id);

    const { rows: files } = await query(
      `SELECT "publicId" FROM "File" WHERE "folderId" = ANY($1::text[])`,
      [folderIds]
    );

    if (files.length > 0) {
      await Promise.all(
        files.map((f) => cloudinary.uploader.destroy(f.publicId).catch(console.error))
      );
    }

    // ON DELETE CASCADE will handle files automatically in DB
    await query(`DELETE FROM "Folder" WHERE id = $1`, [folderId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hard delete folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
