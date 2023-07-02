import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please input a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please insert your email"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Your name is required"],
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "please add a password"],
      pattern: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=])(?!.*\s).{8,32}$/,
        "Wrong password input,your password must contain numbers and letters",
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
