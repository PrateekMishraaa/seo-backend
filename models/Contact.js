import mongoose,{Schema} from "mongoose"


const ContactSchema = new Schema({
    Name:{
        type:String,
        requird:true
    },
    Email:{
        type:String,
        required:true
    },
    Message:{
        type:String,
        required:true,
        maxlength:[200,"Message should not be more than 200 characters"]
    }
},{
    timestamps:true
})
const Contact = mongoose.model("Contacts",ContactSchema)
export default Contact