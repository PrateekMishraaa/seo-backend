import express from "express"
const router = express.Router()
import Contact from "../models/Contact.js"



router.post("/contact",async(req,res)=>{
    const {Name,Email,Message} = req.body;
    if(!Name || !Email || !Message){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const NewMessage = await Contact.create({
            Name,
            Email,
            Message
        })
        console.log("New Contact",NewMessage)
        res.status(200).json({message:"New message on db",newmessage:NewMessage})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error",error})
    }
})




export default router