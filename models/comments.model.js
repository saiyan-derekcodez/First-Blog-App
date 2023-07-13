import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please input your fullname"],
  },
  email: {
    type: String,
    required: [true, "Please input your name"],
  },
  comment: {
    type: String,
    required: [true, "please write a comment"],
  },
  postId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const commentModel = mongoose.model("Comments", commentSchema);

export default commentModel;
