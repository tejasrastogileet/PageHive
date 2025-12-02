
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSimpleAuthStore } from "../store/simpleAuthStore";

export default function RootLayout() {
  const user = useSimpleAuthStore((state) => state.user);
  const isLoading = useSimpleAuthStore((state) => state.isLoading);
  const initAuth = useSimpleAuthStore((state) => state.initAuth);

  useEffect(() => {
    // Initialize auth on app start (check AsyncStorage)
    initAuth();
  }, [initAuth]);

  // Watch for user state changes and navigate accordingly
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User logged in - navigate to home
        console.log("User logged in, navigating to home");
      } else {
        // User logged out - navigate to auth
        console.log("User logged out, navigating to auth");
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return null; // Or show a splash screen
  }

  return (
    <SafeAreaProvider>
      <Stack 
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? "(tabs)" : "(auth)"}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            animationEnabled: false,
            gestureEnabled: false 
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            animationEnabled: true,
            gestureEnabled: false 
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
