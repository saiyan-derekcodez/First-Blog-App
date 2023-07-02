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
    postStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

const blogpostModel = mongoose.model("Blog post", blogpostSchema);

export default blogpostModel;
