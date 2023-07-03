import { Router } from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import userModel from "./../models/users.model.js";
import blogpostModel from "./../models/blogpost.model.js";

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

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/Newblog", async (req, res) => {
  try {
    const cookie = req.cookies;

    if (typeof cookie.id === "undefined") {
      res.redirect("/login");
      return;
    }

    const user = await userModel.findOne({ username: cookie.id });

    if (user === null) {
      res.redirect("/register");
      return;
    }

    res.render("new-blog", { author: user.name, post: "Posted" });
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

    res.cookie("id", req.body.email);

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.render("register");
});

router.post("/Newblog", upload.single("file"), async (req, res) => {
  try {
    const fileData = {
      filePath: req.file.path,
      fileData: req.file.buffer,
      userId: req.body.userId, // Assuming userId is sent as a field in the form
    };

    userFiles.push(fileData);

    const blogPost = req.body;

    const blogPostRender = await blogpostModel.create(blogPost);

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
