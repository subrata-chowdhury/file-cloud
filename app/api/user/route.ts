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

    const { rows } = await query(`SELECT id, name, email FROM "User" WHERE id = $1`, [userId]);

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
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        sendEvent({ progress: 0, total: 100, message: 'Fetching files...' });

        // 1. Fetch all files owned by user
        const { rows: files } = await query(`SELECT "publicId" FROM "File" WHERE "ownerId" = $1`, [
          userId,
        ]);
        const total = files.length;

        // 2. Delete from Cloudinary in batches
        if (total > 0) {
          const { v2: cloudinary } = await import('cloudinary');
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });

          const publicIds = files.map((f) => f.publicId);
          const BATCH_SIZE = 10;
          let deletedCount = 0;

          for (let i = 0; i < publicIds.length; i += BATCH_SIZE) {
            const batch = publicIds.slice(i, i + BATCH_SIZE);
            await Promise.all(
              batch.map((pid) => cloudinary.uploader.destroy(pid).catch(console.error))
            );
            deletedCount += batch.length;
            sendEvent({
              progress: deletedCount,
              total,
              message: `Deleted ${deletedCount} of ${total} files...`,
            });
          }
        } else {
          sendEvent({ progress: 100, total: 100, message: 'No files to delete...' });
        }

        sendEvent({ progress: total, total, message: 'Cleaning up database...' });

        // Delete shares where user is recipient (shared with me)
        await query(`DELETE FROM "FileShare" WHERE "userId" = $1`, [userId]);

        // Delete shares for files owned by user
        await query(
          `DELETE FROM "FileShare" WHERE "fileId" IN (SELECT id FROM "File" WHERE "ownerId" = $1)`,
          [userId]
        );

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

        sendEvent({ progress: total, total, message: 'Account deleted successfully', done: true });
        controller.close();
      } catch (error) {
        console.error('Delete user error:', error);
        sendEvent({ error: 'Internal server error', done: true });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
