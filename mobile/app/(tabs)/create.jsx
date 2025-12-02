
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSimpleAuthStore } from "../../store/simpleAuthStore";
import useApi from "../../lib/apiService";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import PaghiveScreenWrapper from "../../components/PaghiveScreenWrapper";
import PaghiveInput from "../../components/PaghiveInput";
import PaghiveButton from "../../components/PaghiveButton";
import PaghiveHeader from "../../components/PaghiveHeader";
import PaghiveCard from "../../components/PaghiveCard";
import { PAGHIVE_COLORS } from "../../constants/paghiveTheme";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null); // to display the selected image
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useSimpleAuthStore();
  const api = useApi();

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          console.warn("Permission Denied: camera roll permissions required");
          return;
        }
      }

      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // lower quality for smaller base64
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // if base64 is provided, use it

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          // otherwise, convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      console.warn("There was a problem selecting your image");
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      console.warn("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // get file extension from URI or default to jpeg
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      await api.post("/books", {
        title,
        caption,
        rating: rating.toString(),
        image: imageDataUrl,
        email: user?.email,
      });

      console.log("Your book recommendation has been posted");
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      console.warn("Error creating post:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={{ marginRight: 12 }}
        >
          <Text style={{ fontSize: 32, color: i <= rating ? PAGHIVE_COLORS.accentGold : PAGHIVE_COLORS.secondaryText }}>
            {i <= rating ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: "row", marginBottom: 16, marginVertical: 12 }}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <PaghiveScreenWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <PaghiveHeader title="PageHive" subtitle="Add Book Recommendation" />
          <PaghiveCard>
            <PaghiveInput
              placeholder="Book Title"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={{ color: PAGHIVE_COLORS.primaryText, fontWeight: "600", marginBottom: 6 }}>Your Rating</Text>
            {renderRatingPicker()}
            <Text style={{ color: PAGHIVE_COLORS.primaryText, fontWeight: "600", marginBottom: 6 }}>Book Image</Text>
            <PaghiveButton
              title={image ? "Change Image" : "Select Image"}
              onPress={pickImage}
              style={{ backgroundColor: PAGHIVE_COLORS.accentGold, marginBottom: 12 }}
            />
            {image && (
              <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 12, alignSelf: "center", marginBottom: 12 }} />
            )}
            <PaghiveInput
              placeholder="Write your review or thoughts about this book..."
              value={caption}
              onChangeText={setCaption}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
            <PaghiveButton
              title={loading ? "Sharing..." : "Share"}
              onPress={handleSubmit}
              disabled={loading}
            />
            {loading && <ActivityIndicator color={PAGHIVE_COLORS.accentGold} style={{ marginTop: 8 }} />}
          </PaghiveCard>
        </ScrollView>
      </PaghiveScreenWrapper>
    </KeyboardAvoidingView>
  );
}
