import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { rows } = await query(
      `SELECT * FROM "Folder" WHERE "ownerId" = $1 AND id = $2 LIMIT 1`,
      [userId, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Fetch folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 1. Find all nested folders using a recursive CTE
    const { rows: nestedFolders } = await query(
      `WITH RECURSIVE folder_tree AS (
         SELECT id FROM "Folder" WHERE id = $1 AND "ownerId" = $2
         UNION ALL
         SELECT f.id FROM "Folder" f
         INNER JOIN folder_tree ft ON f."parentId" = ft.id
       )
       SELECT id FROM folder_tree`,
      [id, userId]
    );

    if (nestedFolders.length === 0) {
      return NextResponse.json({ error: 'Folder not found or unauthorized' }, { status: 404 });
    }

    const folderIds = nestedFolders.map((f) => f.id);

    // 2. Find all files in these folders
    const { rows: filesToDelete } = await query(
      `SELECT "publicId" FROM "File" WHERE "folderId" = ANY($1::text[])`,
      [folderIds]
    );

    // 3. Delete files from Cloudinary
    if (filesToDelete.length > 0) {
      const publicIds = filesToDelete.map((f) => f.publicId);
      // Delete from Cloudinary concurrently
      await Promise.all(
        publicIds.map((pid) =>
          cloudinary.uploader.destroy(pid).catch((err) => {
            console.error('Failed to delete from Cloudinary:', pid, err);
          })
        )
      );

      // Explicitly delete the files from the database just in case the ON DELETE CASCADE constraint isn't active
      await query(`DELETE FROM "File" WHERE "folderId" = ANY($1::text[])`, [folderIds]);
    }

    // 4. Delete the root folder from DB. ON DELETE CASCADE will handle the rest of the DB rows.
    const { rowCount } = await query(`DELETE FROM "Folder" WHERE id = $1 AND "ownerId" = $2`, [
      id,
      userId,
    ]);

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Folder not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Delete folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
