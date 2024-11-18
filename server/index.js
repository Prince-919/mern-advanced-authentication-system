import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config.js";
import dbConnect from "./config/database-config.js";
import authRoutes from "./routes/auth-route.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(cors({ origin: config.get("frontendUrl"), credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

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
