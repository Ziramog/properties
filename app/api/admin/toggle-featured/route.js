import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.role !== 'admin') {
      return Response.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await request.json();
    await connectDB();

    const prop = await Property.findById(id);
    if (!prop) return Response.json({ error: 'No encontrada' }, { status: 404 });

    prop.is_featured = !prop.is_featured;
    await prop.save();

    return Response.json({ success: true, is_featured: prop.is_featured });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
