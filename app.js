import { config } from "dotenv";
config();

import express from "express";
import mongoose, { Mongoose } from "mongoose";
import bodyParser from "body-parser";
import apiRoutes from "./routes/app.routes.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

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
