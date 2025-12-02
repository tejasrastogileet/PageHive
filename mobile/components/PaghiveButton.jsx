import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { PAGHIVE_COLORS, PAGHIVE_RADIUS, PAGHIVE_SHADOW } from "../constants/paghiveTheme";

export default function PaghiveButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: PAGHIVE_COLORS.accentGold,
    borderRadius: PAGHIVE_RADIUS.medium,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 8,
    ...PAGHIVE_SHADOW,
  },
  text: {
    color: PAGHIVE_COLORS.buttonText,
    fontWeight: "600",
    fontSize: 16,
  },
});
