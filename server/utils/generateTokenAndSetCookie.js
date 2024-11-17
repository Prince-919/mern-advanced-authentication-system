import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, config.get("jwtSecret"), {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.get("nodeEnv") === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
