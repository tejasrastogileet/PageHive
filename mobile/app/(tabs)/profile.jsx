
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, RefreshControl, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSimpleAuthStore } from "../../store/simpleAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import PaghiveScreenWrapper from "../../components/PaghiveScreenWrapper";
import PaghiveCard from "../../components/PaghiveCard";
import PaghiveButton from "../../components/PaghiveButton";
import PaghiveHeader from "../../components/PaghiveHeader";
import { PAGHIVE_COLORS } from "../../constants/paghiveTheme";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const router = useRouter();
  const user = useSimpleAuthStore((state) => state.user);
  const logOut = useSimpleAuthStore((state) => state.logOut);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch all books (no auth required for GET /books)
      const response = await fetch("http://10.65.29.77:3000/api/books");
      const result = await response.json();
      // Filter books that belong to this user (if user has ID)
      if (result.books) {
        setBooks(result.books);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);
      // Delete book (would need auth if backend requires it; for now assume public)
      await fetch(`http://10.65.29.77:3000/api/books/${bookId}`, { method: "DELETE" });
      setBooks(books.filter((book) => book._id !== bookId));
      console.log("Recommendation deleted");
    } catch (error) {
      console.error("Failed to delete recommendation", error);
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    handleDeleteBook(bookId);
  };

  const renderBookItem = ({ item }) => (
    <PaghiveCard style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
      <Image source={item.image} style={{ width: 60, height: 60, borderRadius: 12, marginRight: 16 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700", fontSize: 18, color: PAGHIVE_COLORS.primaryText }}>{item.title}</Text>
        <View style={{ flexDirection: "row", marginVertical: 4 }}>{renderRatingStars(item.rating)}</View>
        <Text style={{ color: PAGHIVE_COLORS.secondaryText }} numberOfLines={2}>{item.caption}</Text>
        <Text style={{ color: PAGHIVE_COLORS.secondaryText, fontSize: 13 }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <PaghiveButton
        title={deleteBookId === item._id ? "..." : "Delete"}
        onPress={() => confirmDelete(item._id)}
        style={{ backgroundColor: "#fff", borderColor: PAGHIVE_COLORS.accentGold, borderWidth: 1, minWidth: 70, marginLeft: 8 }}
        disabled={deleteBookId === item._id}
      />
    </PaghiveCard>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : PAGHIVE_COLORS.secondaryText}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((res) => setTimeout(res, 500));
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return (
    <PaghiveScreenWrapper>
      <ActivityIndicator color={PAGHIVE_COLORS.accentGold} size="large" style={{ marginTop: 40 }} />
    </PaghiveScreenWrapper>
  );

  return (
    <PaghiveScreenWrapper>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <PaghiveHeader title="Profile" subtitle={`Welcome, ${user?.name || "User"}`} />
        <TouchableOpacity
          onPress={handleLogout}
          style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: PAGHIVE_COLORS.accentGold, borderRadius: 8 }}
        >
          <Text style={{ color: PAGHIVE_COLORS.primary, fontWeight: "600", fontSize: 12 }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: PAGHIVE_COLORS.secondaryText, marginBottom: 12 }}>{books.length} books</Text>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[PAGHIVE_COLORS.accentGold]}
            tintColor={PAGHIVE_COLORS.accentGold}
          />
        }
        ListEmptyComponent={
          <PaghiveCard style={{ alignItems: "center", marginTop: 40 }}>
            <Ionicons name="book-outline" size={50} color={PAGHIVE_COLORS.secondaryText} />
            <Text style={{ color: PAGHIVE_COLORS.secondaryText, marginTop: 8 }}>No recommendations yet</Text>
            <PaghiveButton title="Add Your First Book" onPress={() => router.push("/create")} />
          </PaghiveCard>
        }
      />
    </PaghiveScreenWrapper>
  );
}
