import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useSimpleAuthStore = create((set) => ({
  user: null,
  isLoading: true,

   
  initAuth: async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        set({ user: JSON.parse(storedUser), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoading: false });
    }
  },

   
  signUp: async (name, email) => {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }
   
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email");
      }
      const user = { name: name.trim(), email: email.trim(), id: Date.now().toString() };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user });
      return user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

   
  logIn: async (name, email) => {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }
   
      const user = { name: name.trim(), email: email.trim(), id: Date.now().toString() };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user });
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

   
  logOut: async () => {
    try {
      await AsyncStorage.removeItem("user");
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
}));
