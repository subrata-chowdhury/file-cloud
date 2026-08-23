import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const fileId = params.id;

    const { rows } = await query('SELECT * FROM "File" WHERE id = $1', [fileId]);
    const file = rows[0];

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (file.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from DB
    await query('DELETE FROM "File" WHERE id = $1', [fileId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const fileId = params.id;
    const body = await req.json();
    const { isPublic, name } = body;

    const { rows: selectRows } = await query('SELECT * FROM "File" WHERE id = $1', [fileId]);
    const file = selectRows[0];

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (file.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Determine what to update
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];
    let paramIndex = 1;

    if (isPublic !== undefined) {
      updateFields.push(`"isPublic" = $${paramIndex}`);
      updateValues.push(isPublic);
      paramIndex++;
    }

    if (name !== undefined) {
      updateFields.push(`"name" = $${paramIndex}`);
      updateValues.push(name);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json(file);
    }

    updateFields.push(`"updatedAt" = NOW()`);
    updateValues.push(fileId);

    const { rows: updateRows } = await query(
      `UPDATE "File" SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      updateValues
    );

    return NextResponse.json(updateRows[0]);
  } catch (error) {
    console.error('Update file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
