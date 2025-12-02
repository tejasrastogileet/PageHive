import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();

  return <View style={[styles.container, { paddingTop: insets.top }]}>{children}</View>;
}

// Deleted: SafeScreen component removed for Clerk integration.
