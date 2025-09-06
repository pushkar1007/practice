import { create } from "zustand";
import axios from "axios";

const USER_SERVER = process.env.NEXT_PUBLIC_USER_SERVER;

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  loginUser: async (email, password) => {
    try {
      const res = await axios.post(`${USER_SERVER}/users/login`, { email, password });
      set({ user: res.data.user });
    } catch (err) {
      console.error("Login failed:", err);
    }
  },

  registerUser: async (name, email, password) => {
    try {
      const res = await axios.post(`${USER_SERVER}/users/register`, {
        name,
        email,
        password,
      });
      set({ user: res.data.user });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  },

  fetchProfile: async () => {
    try {
      const res = await axios.get(`${USER_SERVER}/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set({ user: res.data });
    } catch (err) {
      console.error("Fetching profile failed:", err);
    }
  },

  logout: () => set({ user: null }),
}));
