import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("MONGO_URI is:", process.env.MONGO_URI); // ← add this
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
