import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSimpleAuthStore } from "../../store/simpleAuthStore";
import PaghiveScreenWrapper from "../../components/PaghiveScreenWrapper";
import PaghiveInput from "../../components/PaghiveInput";
import PaghiveButton from "../../components/PaghiveButton";
import PaghiveCard from "../../components/PaghiveCard";
import { PAGHIVE_COLORS } from "../../constants/paghiveTheme";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const logIn = useSimpleAuthStore((state) => state.logIn);

  const handleLogin = async () => {
    console.log("Login button pressed with name:", name, "email:", email);
    
    if (!name || name.trim().length === 0) {
      setError("Name is required");
      return;
    }
    
    if (!email || email.trim().length === 0) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("Calling logIn with:", { name: name.trim(), email: email.trim() });
      const result = await logIn(name.trim(), email.trim());
      console.log("Login successful, result:", result);
      // Navigate to home - auth state will trigger automatic navigation
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <PaghiveScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}>
          <PaghiveCard>
            <Text style={{ fontSize: 28, fontWeight: "700", color: PAGHIVE_COLORS.primaryText, marginBottom: 8, textAlign: "center" }}>
              Welcome Back
            </Text>
            <Text style={{ fontSize: 14, color: PAGHIVE_COLORS.secondaryText, textAlign: "center", marginBottom: 24 }}>
              Sign in to your account
            </Text>

            <PaghiveInput
              placeholder="Your Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError("");
              }}
              editable={!loading}
            />

            <PaghiveInput
              placeholder="Your Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              keyboardType="email-address"
              editable={!loading}
              style={{ marginTop: 12 }}
            />

            {error && (
              <Text style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12, marginTop: 12, textAlign: "center" }}>
                {error}
              </Text>
            )}

            <PaghiveButton 
              title={loading ? "Logging In..." : "Sign In"} 
              onPress={handleLogin} 
              disabled={loading}
            />

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16, gap: 4, flexWrap: "wrap" }}>
              <Text style={{ color: PAGHIVE_COLORS.secondaryText, fontSize: 14 }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={{ color: PAGHIVE_COLORS.accentGold, fontSize: 14, fontWeight: "600" }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </PaghiveCard>
        </View>
      </PaghiveScreenWrapper>
    </KeyboardAvoidingView>
  );
}
