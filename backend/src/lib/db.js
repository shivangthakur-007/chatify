import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("Mongo_URI is nto set");

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("Mongodb Connected:", conn.connection.host);
  } catch (error) {
    console.error("Error connection to MONGODB:", error);
    process.exit(1);
  }
};
