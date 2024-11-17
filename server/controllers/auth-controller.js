import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { User } from "../models/auth-model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import config from "../config/config.js";

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
  static async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password || email === "" || password === "") {
        throw new Error("All fields are required.");
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password." });
      }
      generateTokenAndSetCookie(res, user._id);
      user.lastLogin = new Date();
      await user.save();
      res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  static async logout(req, res) {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;

      await user.save();

      await sendPasswordResetEmail(
        user.email,
        `${config.get("frontendUrl")}/reset-password/${resetToken}`
      );
      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired reset token." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      await sendResetSuccessEmail(user.email);
      res.status(200).json({
        success: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default AuthController;
