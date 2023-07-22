import { config } from "dotenv";
config();

import express from "express";
import mongoose, { Mongoose } from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import apiRoutes from "./routes/app.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
app.use("/images", express.static(path.join(__dirname, "images")));

const DB_URI = process.env.DB_URI;

async function startApp() {
  console.log("starting app...");

  console.log("Connecting to database...");

  await mongoose.connect(DB_URI);

  app.use("", apiRoutes);

  console.log("connected to database successful..");

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log("App is live and running");
  });
}

startApp();
