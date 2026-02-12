const mongoose = require("mongoose");

let connectAttempt = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    connectAttempt++;
    console.log(`[Attempt ${connectAttempt}/${MAX_RETRIES}] Trying to connect to MongoDB...`);
    console.log("MONGO_URL:", process.env.MONGO_URL ? "✓ Set" : "✗ NOT SET - Check Render environment variables!");

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB Connected Successfully!");
    connectAttempt = 0; // Reset on successful connection
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);

    if (connectAttempt < MAX_RETRIES) {
      console.log(`Retrying in 3 seconds... (${connectAttempt}/${MAX_RETRIES})`);
      setTimeout(connectDB, 3000);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

module.exports = connectDB;