import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";
import cors from "cors";
dotenv.config();

job.start();

const PORT = process.env.PORT || 5000;


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, 
  })
);
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);



const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("Server started on port:", PORT);
    });

  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();