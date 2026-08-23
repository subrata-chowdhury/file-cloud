import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await query(`SELECT name, email FROM "User" WHERE id = $1`, [userId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, currentPassword, newPassword } = await req.json();

    if (name) {
      await query(`UPDATE "User" SET name = $1, "updatedAt" = NOW() WHERE id = $2`, [name, userId]);
    }

    if (currentPassword && newPassword) {
      const { rows } = await query(`SELECT password FROM "User" WHERE id = $1`, [userId]);
      const user = rows[0];
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query(`UPDATE "User" SET password = $1, "updatedAt" = NOW() WHERE id = $2`, [
        hashedPassword,
        userId,
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const publicIds = files.map((f) => f.publicId);
      await Promise.all(
        publicIds.map((pid) => cloudinary.uploader.destroy(pid).catch(console.error))
      );
    }

    // 3. Delete files, folders, and notifications from DB explicitly
    await query(`DELETE FROM "File" WHERE "ownerId" = $1`, [userId]);
    await query(`DELETE FROM "Folder" WHERE "ownerId" = $1`, [userId]);
    await query(`DELETE FROM "Notification" WHERE "userId" = $1`, [userId]);

    // 4. Finally delete the user
    await query(`DELETE FROM "User" WHERE id = $1`, [userId]);

    // 5. Clear the auth cookie
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
