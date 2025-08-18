import { Router } from "express";
import { getAllAlbums, getAllSongs, getAllSongsOfAlbum, getSong } from "./controller.js";

const router = Router();

router.get("/album/all", getAllAlbums);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbum);
router.get("/song/:id", getSong);

export default router;
