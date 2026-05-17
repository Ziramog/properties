'use server';
import connectDB from '@/config/database';
import Property from '@/models/Property';

async function getPropertyCount() {
  try {
    await connectDB();
    return await Property.countDocuments({});
  } catch (err) {
    console.error('[getPropertyCount] Error:', err.message);
    return 0;
  }
}

export default getPropertyCount;
