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
// router.post("/login", async (req, res) => {
//   const { Email, Password } = req.body;

//   if (!Email || !Password) {
//     return res.status(400).json({ message: "Email and Password are required" });
//   }

//   try {
//     const user = await Users.findOne({ Email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(Password, user.Password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Payload to embed in JWT
//     const payload = {
//       userId: user._id,
//       name: user.FullName,
//       email: user.Email,
//       username: user.UserName,
//       phone: user.PhoneNumber,
//     };

//     // Sign token
//     const token = jwt.sign(payload, "thisissecret", { expiresIn: "7d" });

//     // Respond with token and user info
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: payload, // include decoded user info
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.post("/login",async(req,res)=>{
  const {Email,Password} = req.body;
  if(!Email || !Password){
    return res.status(400).json({message:"Invalid fields"})
  }
  try{
      const isUserExist = await Users.findOne({Email})
      if(!isUserExist){
        return res.status(404).json({message:"user not found"})
      }
      const isMatch = await bcrypt.compare(Password, isUserExist.Password)
      if(!isMatch){
        return res.status(400).json({message:"Incorrect Password"})
      }
      const payload = {
        id:isUserExist.id,
        fullname:isUserExist.FullName,
        email:isUserExist.Email,
        phone:isUserExist.PhoneNumber,
        username:isUserExist.UserName
      }
      const token = jwt.sign(payload,"thisisecret",{expiresIn:"7d"})
      res.status(200).json({
        message:"Login successfull",
        token,
        user:payload
      })
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error",error})
  }
})

export default router;
