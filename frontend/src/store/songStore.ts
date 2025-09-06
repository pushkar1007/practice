import { create } from "zustand";
import axios from "axios";

const SONG_SERVER = process.env.NEXT_PUBLIC_SONG_SERVER;

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  audio: string;
  album_id: string;
}

export interface Album {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
}

interface AlbumWithSongs {
  songs: Song[];
  album: Album;
}

interface SongState {
  song: Song | null;
  songs: Song[];
  recommendedSongs: Song[];
  albums: Album[];
  albumWithSongs: AlbumWithSongs | null;
  fetchAllSongs: () => Promise<void>;
  fetchAllAlbums: () => Promise<void>;
  fetchSongsOfAlbum: (albumId: string) => void;
  getRecommendedSongs: (songs: Song[], count: number) => void;
  fetchSong: (songId: string) => void;
}

export const useSongStore = create<SongState>((set) => ({
  song: null,
  songs: [],
  recommendedSongs: [],
  albums: [],
  albumWithSongs: null,

  fetchAllSongs: async () => {
    const res = await axios.get(`${SONG_SERVER}/song/all`);
    set({ songs: res.data });
  },

  fetchAllAlbums: async () => {
    const res = await axios.get(`${SONG_SERVER}/album/all`);
    set({ albums: res.data });
  },

  fetchSongsOfAlbum: async (albumId) => {
    const res = await axios.get(`${SONG_SERVER}/album/${albumId}`);
    set({ albumWithSongs: res.data });
  },

  getRecommendedSongs: (songs, count = 5) => {
    if (!songs?.length) return [];

    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    set({ recommendedSongs: selected });
  },

  fetchSong: async (songId) => {
    try {
      const res = await axios.get(`${SONG_SERVER}/song/${songId}`);
      set({ song: res.data });
    } catch (err) {
      console.error("Song not found", err);
      set({ song: null });
    }
  },
}));
