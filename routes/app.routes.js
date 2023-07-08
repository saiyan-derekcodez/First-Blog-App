import { Router } from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import userModel from "./../models/users.model.js";
import blogpostModel from "./../models/blogpost.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const userFiles = [];

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

router.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogContent = await blogpostModel.findOne({
      _id: new ObjectId(blogId),
    });

    res.render("blogcontent", { blogContent });
  } catch (error) {}
});

router.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;

    if (typeof cookie.id === "undefined") {
      res.render("login", { error: "Please login your signed out" });
      return;
    }

    const profile = await userModel.findOne({ username: cookie.id });

    if (profile === null) {
      res.render("register", { error: "Please create an account" });
      return;
    }

    // gets the authors name from the users database
    const author = await userModel.findOne({ name: profile.name });

    // gets the authors blog from the blogs database
    const myBlogs = await blogpostModel.find({ author: author.name });

    res.render("profile", {
      myBlogs,
      name: profile.name,
    });
  } catch (error) {}
});

router.get("/Newblog", async (req, res) => {
  try {
    const cookie = req.cookies;

    if (typeof cookie.id === "undefined") {
      res.render("login", { error: "Please login your signed out" });
      return;
    }

    const user = await userModel.findOne({ username: cookie.id });

    if (user === null) {
      res.render("register", { error: "Please create an account" });
      return;
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

router.post("/Newblog", async (req, res) => {
  try {
    const blogPost = req.body;

    await blogpostModel.create(blogPost);

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

export default router;
