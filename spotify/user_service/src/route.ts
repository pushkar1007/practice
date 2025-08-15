import { Router } from "express";
import { loginUser, myProfile, registerUser } from "./controller.js";
import { isAuth } from "./middleware.js";

const router = Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/me", isAuth, myProfile);

export default router;
