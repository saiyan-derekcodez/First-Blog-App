import mongoose from "mongoose";

const blogpostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A title is required"],
    },
    content: {
      type: String,
      required: [true, "Please add a content"],
    },
    author: {
      type: String,
      required: [true],
    },
    category: {
      type: String,
      required: [true, "please add a category"],
    },
    image: {
      type: String,
      required: [true, "please add a pic url"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const blogpostModel = mongoose.model("BlogPost", blogpostSchema);

export default blogpostModel;
