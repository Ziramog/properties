import fs from 'fs';

const run = async () => {
  const uploadData = new FormData();
  const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });
  
  uploadData.append('file', blob);
  uploadData.append('upload_preset', 'property_pulse_unsigned');
  
  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dunkbcery/image/upload', {
      method: 'POST',
      body: uploadData
    });
    
    console.log("Status:", res.status);
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
};
run();
