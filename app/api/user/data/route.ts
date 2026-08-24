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
          const publicIds = files.map((f) => f.publicId);
          const BATCH_SIZE = 10;
          let deletedCount = 0;

          for (let i = 0; i < publicIds.length; i += BATCH_SIZE) {
            const batch = publicIds.slice(i, i + BATCH_SIZE);
            await Promise.all(
              batch.map((pid) =>
                cloudinary.uploader.destroy(pid).catch((err) => {
                  console.error('Failed to delete from Cloudinary:', pid, err);
                })
              )
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

        // 3. Delete files from DB explicitly
        await query(`DELETE FROM "File" WHERE "ownerId" = $1`, [userId]);
        // 4. Delete folders from DB explicitly
        await query(`DELETE FROM "Folder" WHERE "ownerId" = $1`, [userId]);
        // 5. Delete notifications from DB explicitly
        await query(`DELETE FROM "Notification" WHERE "userId" = $1`, [userId]);

        sendEvent({ progress: total, total, message: 'Data deleted successfully', done: true });
        controller.close();
      } catch (error) {
        console.error('Delete user data error:', error);
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
