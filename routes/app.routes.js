import { Router } from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import userModel from "./../models/users.model.js";
import blogpostModel from "./../models/blogpost.model.js";
import commentModel from "./../models/comments.model.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Console } from "console";
const ObjectId = mongoose.Types.ObjectId;

const router = Router();
// const router = express.Router();

const __dirname = "./";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images")); // Use __dirname to get the current directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const techCategory = await blogpostModel.find({ category: "Technology" });
    const wellnessCategory = await blogpostModel.find({ category: "Wellness" });
    const AllCategory = await blogpostModel.find({});

    res.render("home", {
      techs: techCategory,
      AllCategory: AllCategory,
      wellnesss: wellnessCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/newBlog", async (req, res) => {
  try {
    const cookie = req.cookies;

    if (typeof cookie.id === "undefined") {
      return res.render("login", { error: "Please log in to your account." });
    }

    const user = await userModel.findOne({ username: cookie.id });

    if (!user) {
      return res.render("register", { error: "Please create an account." });
    }

    res.render("new-blog", { author: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/business", (req, res) => {
  res.render("business");
});

router.get("/gaming", (req, res) => {
  res.render("gaming");
});

router.get("/science", (req, res) => {
  res.render("science");
});

router.get("/health", (req, res) => {
  res.render("health");
});

router.get("/shop", (req, res) => {
  res.render("shop");
});

router.get("/technology", (req, res) => {
  res.render("technology");
});

router.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;

    if (typeof cookie.id === "undefined") {
      return res.render("login", { error: "Please log in to your account." });
    }

    const profile = await userModel.findOne({ username: cookie.id });

    if (!profile) {
      return res.render("register", { error: "Please create an account." });
    }

    const author = await userModel.findOne({ name: profile.name });

    const myBlogs = await blogpostModel.find({ author: author.name });

    res.render("profile", {
      myBlogs,
      name: profile.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/newBlog", upload.single("image"), async (req, res) => {
  try {
    const { title, category, content, author } = req.body;
    const filePath = req.file
      ? path.join(__dirname, "images", req.file.filename)
      : "";
    await blogpostModel.create({
      title,
      category,
      content,
      author,
      image: filePath,
    });

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });

  try {
    res.clearCookie("id");

    if (user === null) {
      res.render("login", { error: "invalid credentials" });
      return;
    }
    if (bcrypt.compareSync(password, user.password) === false) {
      res.render("login", { error: "invalid credentials" });
      return;
    }

    res.cookie("id", user.username);

    res.redirect("/");
  } catch (error) {
    res.render("login", { error: error.message });
  }
});

router.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogContent = await blogpostModel.findById(blogId);

    if (!blogContent) {
      // Handle the case where the blog post doesn't exist
      return res.status(404).json({ message: "Blog post not found" });
    }

    const blogCategory = await blogpostModel.find({
      category: blogContent.category,
    });

    const comments = await commentModel.find({ postId: blogId });

    const cookie = req.cookies.id;

    const user = await userModel.findOne({ username: cookie });

    const AllCategory = await blogpostModel.find({});

    res.render("blogcontent", {
      blogContent,
      blogCategory,
      comments,
      user,
      AllCategory: AllCategory,
      cookie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const commentInfo = req.body;
  const cookie = req.cookies.id;

  try {
    if (typeof cookie === "undefined") {
      res.render("login", {
        error:
          "cannot comment without signing in, Please sign in if you have an account",
      });
      return;
    }

    await commentModel.create(commentInfo);

    res.redirect(req.get("referer"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile/:blogId", async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await blogpostModel.findOne({ _id: blogId });
    res.json({ blog: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/images/:file", (req, res) => {
  const { file } = req.params;

  try {
    // Send the image file
    const blog = path.join(__dirname, "images", file);
    console.log(blog);
    res.json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/register", async (req, res) => {
  const userInfo = req.body;

  try {
    await userModel.create(userInfo);

    res.clearCookie("id");
    res.clearCookie("dis");

    res.cookie("id", req.body.username);

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  // res.render("register");
});

router.delete("/profile/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    await blogpostModel.deleteOne({ _id: new ObjectId(blogId) });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
});

router.patch("/profile/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const update = req.body;

  try {
    // MAKE THE UPDATE
    await blogpostModel.updateOne(
      { _id: new ObjectId(blogId) },
      { $set: { ...update } }
    );

    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
