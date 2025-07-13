import express from "express"
const router = express.Router()
import Users from "../models/Users.js"



router.post("/signup",async(req,res)=>{
    const {FullName,Email,UserName,Password,PhoneNumber} = req.body;

    if(!FullName || !Email || !UserName || !Password || !PhoneNumber){
        return res.status(400).json({message:"All fields are required",})
    }
    try{
            const isUser = await Users.findOne({Email})
            if(isUser){
                return res.status(203).json({message:"User already exists with this email"})
            }
            const NewUser = await Users.create({
                FullName,
                Email,
                UserName,
                Password,
                PhoneNumber
            })
            console.log(NewUser)
            res.status(200).json({message:"User created",newuser:NewUser})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error",error})
    }
})



export default router