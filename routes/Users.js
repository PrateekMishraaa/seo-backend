import express from "express";
import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const SecretKey = process.env.JWTSECRET; // make sure this is set in .env

/* ---------- SIGN‑UP ---------- */
router.post("/signup", async (req, res) => {
  const { FullName, Email, UserName, Password, PhoneNumber } = req.body;

  if (!FullName || !Email || !UserName || !Password || !PhoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    /** 1. Duplicate check (409 = conflict) */
    const existing = await Users.findOne({ Email });
    if (existing) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    /** 2. Create user (pre‑save hook hashes password) */
    const newUser = await Users.create({
      FullName,
      Email,
      UserName,
      Password,
      PhoneNumber,
    });

    /** 3. Strip password before sending */
    const { Password: _pw, ...userWithoutPw } = newUser.toObject();

    res.status(201).json({ message: "User created", user: userWithoutPw });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    /** 1. Find user */
    const user = await Users.findOne({ Email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /** 2. Compare passwords */
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    /** 3. Generate JWT */
    const token = jwt.sign({ id: user._id }, "thisissecret", { expiresIn: "7d" });

    /** 4. Strip password before sending */
    const { Password: _pw, ...userWithoutPw } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPw,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
