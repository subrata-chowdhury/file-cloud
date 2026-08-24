import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');

    const conditions: string[] = ['"ownerId" = $1'];
    const params: unknown[] = [userId];

    if (folderId) {
      conditions.push(`"folderId" = $2`);
      params.push(folderId);
    } else {
      conditions.push(`"folderId" IS NULL`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const { rows } = await query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE "mimeType" LIKE 'image/%') as images,
        COUNT(*) FILTER (WHERE "mimeType" LIKE 'video/%') as videos,
        COUNT(*) FILTER (WHERE "mimeType" NOT LIKE 'image/%' AND "mimeType" NOT LIKE 'video/%') as documents,
        COUNT(*) FILTER (WHERE "isPublic" = true) as public_files,
        COUNT(*) FILTER (WHERE "isPublic" = false) as private_files
       FROM "File" ${whereClause}`,
      params
    );

    const counts = rows[0] || {
      total: 0,
      images: 0,
      videos: 0,
      documents: 0,
      public_files: 0,
      private_files: 0,
    };

    return NextResponse.json({
      type: {
        all: parseInt(counts.total || 0, 10),
        image: parseInt(counts.images || 0, 10),
        video: parseInt(counts.videos || 0, 10),
        document: parseInt(counts.documents || 0, 10),
      },
      privacy: {
        all: parseInt(counts.total || 0, 10),
        public: parseInt(counts.public_files || 0, 10),
        private: parseInt(counts.private_files || 0, 10),
      },
    });
  } catch (error) {
    console.error('Fetch file counts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
