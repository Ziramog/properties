require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const prop = await db.collection('properties').findOne({ _id: new mongoose.Types.ObjectId('6a1ef00fcc2728080238e514') });
  console.log("Coordinates:", prop.coordinates);
  console.log("Location:", prop.location);
  console.log("Price:", prop.price);
  await mongoose.disconnect();
}
run();
