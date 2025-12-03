import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error("Mongo_URI is nto set");

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected:", conn.connection.host);
  } catch (error) {
    console.error("Error connection to MONGODB:", error);
    process.exit(1);
  }
};
