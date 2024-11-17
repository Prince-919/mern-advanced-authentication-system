import express from "express";
import config from "./config/config.js";

const app = express();

const startServer = async () => {
  try {
    const port = config.get("port") || 8000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log("Failed to start server: ", err);
  }
};

startServer();
