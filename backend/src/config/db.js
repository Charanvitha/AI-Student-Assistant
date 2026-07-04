import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
    process.exit(1);
  }
}