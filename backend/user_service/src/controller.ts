import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import TryCatch from "./TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    res.status(404).json({
      message: "User already exists",
    });
    return;
  }

  let username = await User.findOne({ name });

  if (username) {
    res.status(404).json({
      message: "Username already taken",
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  res.status(201).json({
    message: "user registered successfully",
    user,
    token,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User does not exist",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user?.password);

  if (!isMatch) {
    res.status(404).json({
      message: "Password is incorrect",
    });
    return;
  }
  const token = jwt.sign(
    { _id: user?._id },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({
    message: "User Logged In successfully",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});
