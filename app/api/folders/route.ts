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
      CREATE TABLE IF NOT EXISTS "Folder" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "parentId" TEXT,
          "ownerId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
      );
    `);

    // We can't easily do DO $$ blocks in some pg drivers through parameterized queries without care,
    // but we can just run ALTER TABLE IF NOT EXISTS logic via a quick hack or multiple queries.
    // To be safe, we'll try catching the error if the column already exists.
    try {
      await query(`ALTER TABLE "File" ADD COLUMN "folderId" TEXT;`);
    } catch (e) {
      // Column already exists, ignore
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');
    const isFavorite = searchParams.get('isFavorite');

    let rows;
    if (isFavorite === 'true') {
      // Fetch all favorite folders regardless of nesting
      const res = await query(
        `SELECT * FROM "Folder" WHERE "ownerId" = $1 AND "isFavorite" = true AND "isTrashed" = false ORDER BY "name" ASC`,
        [userId]
      );
      rows = res.rows;
    } else if (parentId) {
      const res = await query(
        `SELECT * FROM "Folder" WHERE "ownerId" = $1 AND "parentId" = $2 AND "isTrashed" = false ORDER BY "name" ASC`,
        [userId, parentId]
      );
      rows = res.rows;
    } else {
      const res = await query(
        `SELECT * FROM "Folder" WHERE "ownerId" = $1 AND "parentId" IS NULL AND "isTrashed" = false ORDER BY "name" ASC`,
        [userId]
      );
      rows = res.rows;
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Fetch folders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, parentId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const id = randomUUID();
    const { rows } = await query(
      `INSERT INTO "Folder" (id, name, "parentId", "ownerId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [id, name, parentId || null, userId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
