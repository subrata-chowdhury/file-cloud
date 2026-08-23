import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch all files owned by user
    const { rows: files } = await query(`SELECT "publicId" FROM "File" WHERE "ownerId" = $1`, [
      userId,
    ]);

    // 2. Delete from Cloudinary
    if (files.length > 0) {
      const publicIds = files.map((f) => f.publicId);
      await Promise.all(
        publicIds.map((pid) =>
          cloudinary.uploader.destroy(pid).catch((err) => {
            console.error('Failed to delete from Cloudinary:', pid, err);
          })
        )
      );
    }

    // 3. Delete files from DB explicitly
    await query(`DELETE FROM "File" WHERE "ownerId" = $1`, [userId]);

    // 4. Delete folders from DB explicitly
    await query(`DELETE FROM "Folder" WHERE "ownerId" = $1`, [userId]);

    // 5. Delete notifications from DB explicitly
    await query(`DELETE FROM "Notification" WHERE "userId" = $1`, [userId]);

    return NextResponse.json({ success: true, message: 'All data deleted successfully' });
  } catch (error) {
    console.error('Delete user data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
