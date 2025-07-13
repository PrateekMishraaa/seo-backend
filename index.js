import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
const port = process.env.port
import mongoose from "mongoose"
import User from "./routes/Users.js"


mongoose.connect(process.env.MONGOURI)
.then(()=>console.log("Db Connected"))
.catch(()=>console.log("disconnected"))
app.use(express.json())
app.use("/api",User)
app.get("/",(req,res)=>{
    console.log("hello world")
    res.send("hello`")
})



app.listen(port,()=>console.log(`server start at port ${port}`))