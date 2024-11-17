import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
