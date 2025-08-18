import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

export const redisClient = redis.createClient({
  password: process.env.REDIS_USER_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((error) =>
    console.log("Redis Connection failed due to Error: ", error)
  );

const Port = process.env.PORT;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/v1", songRoutes);

app.listen(Port, () => {
  console.log(`Server is running on Port: ${Port}`);
  console.log(`http://localhost:${Port}`);
});
