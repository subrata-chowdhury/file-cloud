import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Auto-migrate schema on fetch
    await query(`
      CREATE TABLE IF NOT EXISTS "Notification" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "severity" TEXT NOT NULL,
          "isRead" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    const { rows: existing } = await query(
      `SELECT id FROM "Notification" WHERE "userId" = $1 LIMIT 1`,
      [userId]
    );

    // Inject dummy data on first load
    if (existing.length === 0) {
      await query(
        `
        INSERT INTO "Notification" (id, "userId", title, message, type, severity, "isRead") VALUES 
        ($1, $2, $3, $4, $5, $6, $7),
        ($8, $2, $9, $10, $11, $12, $13)
      `,
        [
          randomUUID(),
          userId,
          'New Login Detected',
          'A new login was detected from a new device.',
          'Security',
          'high',
          false,
          randomUUID(),
          'System Update',
          'FileCloud has been updated to v2.0 with the new SaaS dashboard layout!',
          'System',
          'low',
          false,
        ]
      );
    }

    const { rows } = await query(
      `SELECT * FROM "Notification" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    if (body.action === 'mark_all_read') {
      await query(`UPDATE "Notification" SET "isRead" = true WHERE "userId" = $1`, [userId]);
      return NextResponse.json({ message: 'All notifications marked as read' });
    } else if (body.id) {
      await query(`UPDATE "Notification" SET "isRead" = true WHERE "userId" = $1 AND id = $2`, [
        userId,
        body.id,
      ]);
      return NextResponse.json({ message: 'Notification marked as read' });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    await query(`DELETE FROM "Notification" WHERE id = $1 AND "userId" = $2`, [id, userId]);

    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
