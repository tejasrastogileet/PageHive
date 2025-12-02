// Metro configuration for React Native
// Uses the modern expo/metro-config package instead of the deprecated expo-cli internals.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
