import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./route.js";

dotenv.config({
  path: "./.env",
});

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "Spotify",
    });
    console.log("MongoDB Connection Established!!");
  } catch (error) {
    console.log("MongoDB Connection Failed!!");
    console.log("Error: ", error);
  }
};

const Port = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(Port, () => {
  console.log(`Server is running on Port: ${Port}`);
  console.log(`http://localhost:${Port}`);
  connectDB();
});
