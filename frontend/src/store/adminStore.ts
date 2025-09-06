import { create } from "zustand";
import axios from "axios";

const ADMIN_SERVER = process.env.NEXT_PUBLIC_ADMIN_SERVER; 

interface AdminState {
  addAlbum: (album: { title: string; description?: string }) => Promise<void>;
  addSong: (song: {
    title: string;
    albumId: string;
    audio: string;
  }) => Promise<void>;
  addThumbnail: (songId: string, thumbnail: File) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>(() => ({
  addAlbum: async (album) => {
    await axios.post(`${ADMIN_SERVER}/album/new`, album);
  },

  addSong: async (song) => {
    await axios.post(`${ADMIN_SERVER}/song/new`, song);
  },

  addThumbnail: async (songId, thumbnail) => {
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    await axios.post(`${ADMIN_SERVER}/song/${songId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteAlbum: async (albumId) => {
    await axios.delete(`${ADMIN_SERVER}/album/${albumId}`);
  },

  deleteSong: async (songId) => {
    await axios.delete(`${ADMIN_SERVER}/song/${songId}`);
  },
}));
