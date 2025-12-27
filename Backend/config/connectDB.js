import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URL) {
  throw new Error("");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Kết nối MongoDB thành công!");
  } catch (error) {
    console.log("Lỗi kết nối MongoDB", error);
    process.exit(1);
  }
}
export default connectDB;
