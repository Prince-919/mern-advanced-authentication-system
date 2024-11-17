import express from "express";
import config from "./config/config.js";
import dbConnect from "./config/database-config.js";
import authRoutes from "./routes/auth-route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await dbConnect();
    const port = config.get("port") || 8000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log("Failed to start server: ", err);
  }
};

startServer();
