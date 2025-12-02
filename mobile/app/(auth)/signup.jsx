
import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSimpleAuthStore } from "../../store/simpleAuthStore";
import PaghiveScreenWrapper from "../../components/PaghiveScreenWrapper";
import PaghiveInput from "../../components/PaghiveInput";
import PaghiveButton from "../../components/PaghiveButton";
import PaghiveCard from "../../components/PaghiveCard";
import PaghiveHeader from "../../components/PaghiveHeader";
import { PAGHIVE_COLORS } from "../../constants/paghiveTheme";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const signUp = useSimpleAuthStore((state) => state.signUp);

  const handleSignUp = async () => {
    console.log("SignUp button pressed with name:", name, "email:", email);
    
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
      console.log("Calling signUp with:", { name: name.trim(), email: email.trim() });
      const result = await signUp(name.trim(), email.trim());
      console.log("SignUp successful, result:", result);
      // Navigate to home - auth state will trigger automatic navigation
      router.replace("/(tabs)");
    } catch (err) {
      console.error("SignUp error:", err.message);
      setError(err.message || "Sign up failed");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <PaghiveScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}>
          {/* App Title and Subtitle */}
          <PaghiveHeader 
            title="PageHive" 
            subtitle="Your Smart Library Companion" 
            style={{ marginBottom: 0, marginTop: 12 }}
          />
          <PaghiveCard>
            <Text style={{ fontSize: 24, fontWeight: "700", color: PAGHIVE_COLORS.primaryText, marginBottom: 8, textAlign: "center" }}>
              Create Account
            </Text>
            <Text style={{ fontSize: 14, color: PAGHIVE_COLORS.secondaryText, textAlign: "center", marginBottom: 24 }}>
              Sign up to start sharing books
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
              title={loading ? "Signing Up..." : "Sign Up"} 
              onPress={handleSignUp} 
              disabled={loading}
            />

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16, gap: 4, flexWrap: "wrap" }}>
              <Text style={{ color: PAGHIVE_COLORS.secondaryText, fontSize: 14 }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)")}>
                <Text style={{ color: PAGHIVE_COLORS.accentGold, fontSize: 14, fontWeight: "600" }}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={{ position: "absolute", right: 12, bottom: 8 }}>
              <Text style={{ fontSize: 11, color: PAGHIVE_COLORS.secondaryText, fontStyle: "italic" }}>
                Made with ❤ by Tejas
              </Text>
            </View>
          </PaghiveCard>
        </View>
      </PaghiveScreenWrapper>
    </KeyboardAvoidingView>
  );
}
