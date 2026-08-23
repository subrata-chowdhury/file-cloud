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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const privacy = searchParams.get('privacy') || 'all';
    const folderId = searchParams.get('folderId');

    const conditions: string[] = ['"ownerId" = $1'];
    const params: unknown[] = [userId];
    let paramIndex = 2;

    if (folderId) {
      conditions.push(`"folderId" = $${paramIndex}`);
      params.push(folderId);
      paramIndex++;
    } else if (!search) {
      // Only restrict to root if not searching globally
      conditions.push(`"folderId" IS NULL`);
    }

    if (search) {
      conditions.push(`name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (type !== 'all') {
      if (type === 'image') {
        conditions.push(`"mimeType" LIKE 'image/%'`);
      } else if (type === 'video') {
        conditions.push(`"mimeType" LIKE 'video/%'`);
      } else if (type === 'document') {
        conditions.push(`"mimeType" NOT LIKE 'image/%' AND "mimeType" NOT LIKE 'video/%'`);
      }
    }

    if (privacy !== 'all') {
      conditions.push(`"isPublic" = $${paramIndex}`);
      params.push(privacy === 'public');
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const { rows: countRows } = await query(`SELECT COUNT(*) FROM "File" ${whereClause}`, params);
    const total = parseInt(countRows[0].count, 10);

    // Add pagination params
    params.push(limit);
    const limitParam = paramIndex++;
    params.push((page - 1) * limit);
    const offsetParam = paramIndex++;

    const { rows: files } = await query(
      `SELECT * FROM "File" ${whereClause} ORDER BY "createdAt" DESC LIMIT $${limitParam} OFFSET $${offsetParam}`,
      params
    );

    return NextResponse.json({
      files,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch files error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, url, publicId, size, mimeType, folderId } = await req.json();

    if (!name || !url || !publicId || size === undefined || !mimeType) {
      return NextResponse.json({ error: 'Missing required file fields' }, { status: 400 });
    }

    const id = randomUUID();
    const { rows } = await query(
      `INSERT INTO "File" (id, name, url, "publicId", size, "mimeType", "isPublic", "ownerId", "folderId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8, NOW(), NOW()) RETURNING *`,
      [id, name, url, publicId, size, mimeType, userId, folderId || null]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Save file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
