import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:8000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error.res.data.message || "Error in signup",
        isLoading: false,
      });
      throw error;
    }
  },
}));
