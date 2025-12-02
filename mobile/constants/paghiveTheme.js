// Paghive Premium Global Theme
const PAGHIVE_COLORS = {
  background: "#F9F7F2",
  primaryText: "#2D2D2D",
  secondaryText: "#6F6F6F",
  primary: "#E0B65A",
  accentGold: "#E0B65A",
  borderColor: "#E2D9C5",
  border: "#E2D9C5",
  cardBackground: "#FFFFFF",
  shadowColor: "rgba(0,0,0,0.05)",
  buttonText: "#FFFFFF",
  textSecondary: "#6F6F6F",
};

const PAGHIVE_SHADOW = {
  shadowColor: PAGHIVE_COLORS.shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 6,
  elevation: 4,
};

const PAGHIVE_RADIUS = {
  small: 10,
  medium: 12,
  large: 16,
};

const PAGHIVE_FONT = {
  title: { fontSize: 30, fontWeight: "700", color: PAGHIVE_COLORS.primaryText },
  subtitle: { fontSize: 16, fontWeight: "500", color: PAGHIVE_COLORS.secondaryText },
  body: { fontSize: 16, color: PAGHIVE_COLORS.primaryText },
  header: { fontSize: 20, fontWeight: "600", color: PAGHIVE_COLORS.primaryText },
};

export { PAGHIVE_COLORS, PAGHIVE_SHADOW, PAGHIVE_RADIUS, PAGHIVE_FONT };
