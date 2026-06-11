import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PROP_ID = '6a1e1b1c09dc76e1323c93f5';

// The 13 original images from backup (all verified HTTP 200)
const ORIGINAL_IMAGES = [
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401155/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/tiixvivst42un2ece5bv.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/tiixvivst42un2ece5bv" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401155/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/tf6mq8amiicmsmp0a785.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/tf6mq8amiicmsmp0a785" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401155/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/xidzodulcnz6exu8djju.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/xidzodulcnz6exu8djju" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401155/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/keiikp2rrcwlydwxatdr.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/keiikp2rrcwlydwxatdr" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401155/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/ijmef3iyccoe1s0ndxar.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/ijmef3iyccoe1s0ndxar" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/xi3rwxiv8aq7jzgpdvmo.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/xi3rwxiv8aq7jzgpdvmo" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/xxsxhpsxxm7jmm62hu3c.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/xxsxhpsxxm7jmm62hu3c" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/pcsjcrpunrg3uspjcluc.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/pcsjcrpunrg3uspjcluc" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/ap5c93k02oqozcb2zifd.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/ap5c93k02oqozcb2zifd" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/fgby9gx6eqwk0lpx553b.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/fgby9gx6eqwk0lpx553b" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/f93wkd2npl2amhse9uoa.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/f93wkd2npl2amhse9uoa" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401156/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/tiefiqjzqovirlpr9ltx.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/tiefiqjzqovirlpr9ltx" },
  { url: "https://res.cloudinary.com/dunkbcery/image/upload/v1780401157/roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/higzy3ndzene9cjp5byf.jpg", public_id: "roggero-roma/properties/6a1e1b1c09dc76e1323c93f5-c-rdoba-falda-del-carmen-la-escondida-casa-de-3-dormitorios/higzy3ndzene9cjp5byf" },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    // 1. Get current (wrong) images to delete from Cloudinary
    const liveProp = await db.collection('properties').findOne({ _id: new mongoose.Types.ObjectId(PROP_ID) });
    const wrongImages = liveProp.images || [];
    
    // 2. Update MongoDB with original 13 images (keep name as-is)
    console.log('Paso 1: Restaurando 13 fotos originales en MongoDB...');
    await db.collection('properties').updateOne(
      { _id: new mongoose.Types.ObjectId(PROP_ID) },
      { $set: { images: ORIGINAL_IMAGES } }
    );
    console.log('✅ MongoDB actualizado con las 13 fotos originales');

    // 3. Delete the 26 wrong images from Cloudinary
    console.log(`\nPaso 2: Eliminando ${wrongImages.length} fotos erróneas de Cloudinary...`);
    const publicIds = wrongImages.map(img => typeof img === 'object' ? img.public_id : null).filter(Boolean);
    
    for (let i = 0; i < publicIds.length; i += 100) {
      const batch = publicIds.slice(i, i + 100);
      const result = await cloudinary.api.delete_resources(batch);
      const deleted = Object.values(result.deleted).filter(v => v === 'deleted').length;
      console.log(`  Lote ${Math.floor(i/100)+1}: ${deleted}/${batch.length} eliminadas`);
    }
    console.log('✅ Fotos erróneas eliminadas de Cloudinary');

    // 4. Verify
    console.log('\nPaso 3: Verificando resultado...');
    const verifyProp = await db.collection('properties').findOne({ _id: new mongoose.Types.ObjectId(PROP_ID) });
    console.log(`  Nombre: ${verifyProp.name}`);
    console.log(`  Imágenes: ${verifyProp.images.length}`);
    console.log(`  Primera foto: ${verifyProp.images[0].url.split('/').pop()}`);
    console.log('\n✅ Restauración completada');

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};
run();
