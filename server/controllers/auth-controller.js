import { User } from "../models/auth-model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

class AuthController {
  static async signup(req, res) {
    const { name, email, password } = req.body;
    try {
      if (
        !name ||
        !email ||
        !password ||
        name === "" ||
        email === "" ||
        password === ""
      ) {
        throw new Error("All fields are required.");
      }
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });
      await user.save();

      generateTokenAndSetCookie(res, user._id);

      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        success: true,
        message: "User created successfully.",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  static async verifyEmail(req, res) {
    const { code } = req.body;
    try {
      const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired verification code.",
        });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();
      await sendWelcomeEmail(user.email, user.name);
      res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  static async login(req, res) {}
}

export default AuthController;
