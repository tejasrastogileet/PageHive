import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { PAGHIVE_COLORS } from "../constants/paghiveTheme";

export default function PaghiveScreenWrapper({ children, style }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGHIVE_COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: PAGHIVE_COLORS.background,
    padding: 24,
  },
});
