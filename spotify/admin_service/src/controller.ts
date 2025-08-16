import { json, type Request } from "express";
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "./config/db.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You does not have the authority to access it",
    });
    return;
  }

  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload",
    });
    return;
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Failed to generate Buffer",
    });
    return;
  }

  const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
    folder: "spotify/albums",
  });

  const result = await sql`
      INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
    `;

  res.json({
    message: "Album Created",
    album: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You does not have the authority to access it",
      });
      return;
    }

    const { title, description, album } = req.body;

    const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;

    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No aLbum id",
        });
        return;
    }
    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No file to upload",
      });
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate File Buffer",
        });
        return;
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "spotify/songs_audio",
        resource_type: "video",
    });

    const result = await sql`
      INSERT INTO songs (title, description, audio, album_id) VALUES (${title}, ${description}, ${cloud.secure_url}, ${album})
    `;

    res.json({
        message: "Song added",
    });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You does not have the authority to access it",
        });
    }

    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id"
        });
    }

    const file = req.file;

    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Failed to generate File Buffer",
        });
        return;
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "spotify/songs_thumbnail",
    });

    const result = await sql`
      UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
    `;

    res.json({
        message: "Thumbnail added",
        song: result[0],
    });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You does not have the authority to access it",
        });
        return;
    }

    const { id } = req.params;

    const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No Album with this id"
        });
    }

    await sql`DELETE FROM songs WHERE album_id = ${id}`;
    await sql`DELETE FROM albums WHERE id = ${id}`;

    res.json({
        message: "album deleted successfully",
    });
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
          message: "You does not have the authority to access it",
        });
        return;
    }

    const { id } = req.params;

    const isSong = await sql`SELECT * FROM songs WHERE id = ${id}`;

    if (isSong.length === 0) {
        res.status(404).json({
            message: "No Song from this id",
        });
        return;
    }

    await sql`DELETE FROM songs WHERE id = ${id}`;

    res.json({
        message: "Song Deleted successfully",
    });
})
