import mongoose from 'mongoose';

export async function connectDatabase() {
  console.log("URI:", process.env.MONGODB_URI);

  const uri = process.env.MONGODB_URI;

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  console.log("MongoDB connected");
}