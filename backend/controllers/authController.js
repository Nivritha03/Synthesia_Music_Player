import User from "../models/userModel.js";
import imagekit from "../config/imagekit.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../utils/sendEmail.js";

dotenv.config();

const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, emailID, Password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "EmailID already exists",
      });
    }

    let avatarUrl = "";

    // ✅ SAFE ImageKit upload (NO crash)
    if (avatar && typeof avatar === "string" && avatar.startsWith("data:image")) {
      try {
        const uploadResponse = await imagekit.upload({
          file: avatar,
          fileName: `avatar_${Date.now()}.jpg`,
          folder: "/mern-music-player",
        });
        avatarUrl = uploadResponse.url;
      } catch (err) {
        console.error("Avatar upload failed, continuing without avatar");
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    const token = createToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Signup not successful:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "EmailID and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ID does not exist" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Login not successful:", error.message);
    res.status(500).json({ message: "Login Error" });
  }
};

/* ================= GET ME ================= */
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  res.status(200).json(req.user);
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If an account exists, a password reset email has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes</p>
      `,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* ================= EDIT PROFILE ================= */
const editProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Both current password and new password are required",
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters long",
        });
      }

      user.password = newPassword;
    }

    // ✅ SAFE avatar update
    if (avatar && typeof avatar === "string" && avatar.startsWith("data:image")) {
      try {
        const uploadResponse = await imagekit.upload({
          file: avatar,
          fileName: `avatar_${Date.now()}.jpg`,
          folder: "/mern-music-player",
        });
        user.avatar = uploadResponse.url;
      } catch (err) {
        console.error("Avatar update failed");
      }
    }

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Edit Profile Error:", error.message);
    res.status(500).json({ message: "Error in updating profile" });
  }
};

export {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  editProfile,
};
