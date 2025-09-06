import { create } from "zustand";
import { Song } from "./songStore";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  duration: number;
  currentTime: number;
  volume: number;
  queue: Song[];
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setDuration: (value: number) => void;
  setCurrentTime: (value: number) => void;
  setVolume: (value: number) => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  audio: null,
  duration: 0,
  currentTime: 0,
  volume: 1,
  queue: [],

  playSong: (song: Song) => {
    const { audio, volume } = get();

    // Stop previous audio
    audio?.pause();

    const newAudio = new Audio(song.audio);
    newAudio.preload = "auto";
    newAudio.volume = volume;

    newAudio.onloadedmetadata = () => set({ duration: newAudio.duration });
    newAudio.ontimeupdate = () => set({ currentTime: newAudio.currentTime });
    newAudio.onended = () => {
      set({ isPlaying: false, currentTime: 0 });
    };

    newAudio
      .play()
      .then(() => set({ currentSong: song, audio: newAudio, isPlaying: true }))
      .catch((err) => console.error("Playback Error:", err));
  },

  togglePlay: () => {
    const { audio, isPlaying } = get();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      audio
        .play()
        .then(() => set({ isPlaying: true }))
        .catch((err) => console.error("Playback Error:", err));
    }
  },

  nextSong: () => {
    const { queue, currentSong, playSong } = get();
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx !== -1 && queue[idx + 1]) playSong(queue[idx + 1]);
  },

  prevSong: () => {
    const { queue, currentSong, playSong } = get();
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx > 0) playSong(queue[idx - 1]);
  },

  setDuration: (value) => set({ duration: value }),
  setCurrentTime: (value) => set({ currentTime: value }),

  setVolume: (value) => {
    const { audio } = get();
    if (audio) audio.volume = value;
    set({ volume: value });
  },

  seek: (time: number) => {
    const { audio } = get();
    if (audio) audio.currentTime = time;
  },

  getCurrentTime: () => get().audio?.currentTime || 0,
}));
