import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { PAGHIVE_COLORS, PAGHIVE_RADIUS, PAGHIVE_SHADOW } from "../constants/paghiveTheme";

export default function PaghiveInput(props) {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor={PAGHIVE_COLORS.secondaryText}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: PAGHIVE_COLORS.cardBackground,
    borderColor: PAGHIVE_COLORS.borderColor,
    borderWidth: 1.3,
    borderRadius: PAGHIVE_RADIUS.medium,
    padding: 14,
    fontSize: 16,
    color: PAGHIVE_COLORS.primaryText,
    marginBottom: 16,
    ...PAGHIVE_SHADOW,
  },
});
