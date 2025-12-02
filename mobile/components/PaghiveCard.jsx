import React from "react";
import { View, StyleSheet } from "react-native";
import { PAGHIVE_COLORS, PAGHIVE_RADIUS, PAGHIVE_SHADOW } from "../constants/paghiveTheme";

export default function PaghiveCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PAGHIVE_COLORS.cardBackground,
    borderRadius: PAGHIVE_RADIUS.large,
    padding: 20,
    marginVertical: 10,
    ...PAGHIVE_SHADOW,
    borderColor: PAGHIVE_COLORS.borderColor,
    borderWidth: 1,
  },
});
