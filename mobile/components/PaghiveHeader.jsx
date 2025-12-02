import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PAGHIVE_FONT, PAGHIVE_COLORS } from "../constants/paghiveTheme";

export default function PaghiveHeader({ title, subtitle, style }) {
  return (
    <View style={[styles.header, style]}>
      <Text style={PAGHIVE_FONT.title}>{title}</Text>
      {subtitle && <Text style={PAGHIVE_FONT.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: PAGHIVE_COLORS.background,
  },
});
