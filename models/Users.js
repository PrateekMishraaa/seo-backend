import mongoose,{Schema} from "mongoose";

const UsersSchema = new Schema({
    FullName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:[true, "Email Should be different"]
    },
        UserName:{
            type:String,
            required:true
        },
        PhoneNumber:{
            type:Number,
            required:true,
            minlength:[10,"Mobile number should be in 10 digits"]
        },
        Password:{
            type:String,
            required:true,
            minlenght:[8,"Password should not be less than 8 character"]
        }
},{
    timestamps:true
})
const Users = mongoose.model("Users",UsersSchema)
export default Users