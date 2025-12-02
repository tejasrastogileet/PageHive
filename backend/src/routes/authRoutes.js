import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Sign up route - Create user
router.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

    // Create new user
    const user = new User({
      name: name.trim(),
      email,
      profileImage,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in signup route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route - Check if user exists, no password needed
router.post("/login", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Check if name matches
    if (user.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(401).json({ message: "Invalid name or email" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
