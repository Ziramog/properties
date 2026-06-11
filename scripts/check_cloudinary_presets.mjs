import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const run = async () => {
  try {
    const presets = await cloudinary.api.upload_presets();
    console.log("Existing presets:", presets.presets);
    
    // Check if one is unsigned
    const unsigned = presets.presets.find(p => p.unsigned);
    if (unsigned) {
      console.log("Unsigned preset found:", unsigned.name);
    } else {
      console.log("No unsigned preset found. Creating one...");
      const newPreset = await cloudinary.api.create_upload_preset({
        name: "property_pulse_unsigned",
        unsigned: true,
        folder: "roggero-roma/properties"
      });
      console.log("Created unsigned preset:", newPreset.name);
    }
  } catch (e) {
    console.error(e);
  }
};
run();
