import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";

import { Image } from "expo-image";
import { useEffect, useState } from "react";


import useApi from "../../lib/apiService";
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "../../lib/utils";
import PaghiveScreenWrapper from "../../components/PaghiveScreenWrapper";
import PaghiveHeader from "../../components/PaghiveHeader";
import Loader from "../../components/Loader";
import { PAGHIVE_COLORS } from "../../constants/paghiveTheme";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const api = useApi();

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const data = await api.get(`/books?page=${pageNum}&limit=2`);

      // todo fix it later
      // setBooks((prevBooks) => [...prevBooks, ...data.books]);

      const uniqueBooks =
        refresh || pageNum === 1
          ? data.books
          : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) =>
              [...books, ...data.books].find((book) => book._id === id)
            );

      setBooks(uniqueBooks);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      if (refresh) {
        await sleep(800);
        setRefreshing(false);
      } else setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit="cover" />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (loading) return <Loader />;

  return (
    <PaghiveScreenWrapper>
      <PaghiveHeader title="Home" subtitle="Your Book List" />
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[PAGHIVE_COLORS.primary]}
            tintColor={PAGHIVE_COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator style={{ marginVertical: 16 }} size="small" color={PAGHIVE_COLORS.primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="book-outline" size={60} color={PAGHIVE_COLORS.textSecondary} />
            <Text style={{ color: PAGHIVE_COLORS.textSecondary, fontSize: 18, marginTop: 12 }}>No recommendations yet</Text>
            <Text style={{ color: PAGHIVE_COLORS.textSecondary, fontSize: 14, marginTop: 4 }}>Be the first to share a book!</Text>
          </View>
        }
      />
    </PaghiveScreenWrapper>
  );
}
