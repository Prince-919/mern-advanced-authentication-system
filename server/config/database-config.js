import mongoose, { connect } from "mongoose";
import config from "./config.js";

const dbConnect = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully.");
    });
    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to database:", err);
    });
    await connect(config.get("databaseUrl"));
  } catch (err) {
    console.log("Failed to connect to database", err);
    process.exit(1);
  }
};

export default dbConnect;
