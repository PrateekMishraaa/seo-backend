import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UsersSchema = new Schema({
  FullName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Email format is invalid"],
  },
  UserName: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: String,
    required: true,
    minlength: [10, "Mobile number should be 10 digits"],
    maxlength: [10, "Mobile number should be 10 digits"],
  },
  Password: {
    type: String,
    required: true,
    minlength: [8, "Password should not be less than 8 characters"],
  },
}, {
  timestamps: true,
});

// Pre-save hook to hash password
UsersSchema.pre("save", async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified("Password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

const Users = mongoose.model("Users", UsersSchema);
export default Users;
