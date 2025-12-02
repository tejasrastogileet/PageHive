import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useSimpleAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  // Initialize — check if user exists in AsyncStorage on app start
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

  // Sign up — save name + email to AsyncStorage and set user
  signUp: async (name, email) => {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }
      // Simple email validation
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

  // Login — check if name + email match (simple lookup)
  logIn: async (name, email) => {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }
      // In a real app, verify against backend or stored list
      // For simplicity, just accept any name + email combination
      const user = { name: name.trim(), email: email.trim(), id: Date.now().toString() };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user });
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout — clear user and remove from AsyncStorage
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
