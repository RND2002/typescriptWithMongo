import mongoose from "mongoose";

const connectDB = async (dbUrl: string) => {
  try {
    await mongoose.connect(dbUrl); // ✅ No need for useNewUrlParser or useUnifiedTopology

    console.log("✅ Connected to MongoDB");

    mongoose.connection.on("error", (error) =>
      console.error("❌ MongoDB connection error:", error)
    );

    mongoose.connection.on("disconnected", () =>
      console.warn("⚠️ MongoDB disconnected!")
    );
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
