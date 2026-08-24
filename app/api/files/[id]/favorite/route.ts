import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unwrappedParams = await params;
    const { isFavorite } = await req.json();

    if (typeof isFavorite !== 'boolean') {
      return NextResponse.json({ error: 'isFavorite must be a boolean' }, { status: 400 });
    }

    const { rows } = await query(
      `UPDATE "File" SET "isFavorite" = $1, "updatedAt" = NOW() WHERE id = $2 AND "ownerId" = $3 RETURNING *`,
      [isFavorite, unwrappedParams.id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'File not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Update favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
