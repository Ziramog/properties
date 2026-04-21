import mongoose from 'mongoose';

let connected = false;
let connecting = false;
let connectionPromise = null;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (connected) {
    return;
  }

  if (connecting) {
    return connectionPromise;
  }

  connecting = true;

  connectionPromise = (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      connected = true;
      connecting = false;
      console.log('MongoDB connected...');
    } catch (error) {
      connecting = false;
      console.log(error);
      throw error;
    }
  })();

  return connectionPromise;
};

export default connectDB;
