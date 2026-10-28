export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'superadmin') {
      return new NextResponse('Acceso no autorizado: requiere rol superadmin', { status: 403 });
    }

    const htmlPath = path.join(process.cwd(), 'data', 'social-studio', 'Roggero_Roma_Social_Studio_2_9.html');
    if (!fs.existsSync(htmlPath)) {
      return new NextResponse('Editor Social Studio 2.9 no encontrado', { status: 404 });
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('[SocialStudio-Embed] Error:', err);
    return new NextResponse('Error al cargar Social Studio', { status: 500 });
  }
}
