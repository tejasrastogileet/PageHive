import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useSimpleAuthStore } from "../store/simpleAuthStore";
import { useRouter } from "expo-router";
import styles from "../assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function LogoutButton() {
  const { logOut } = useSimpleAuthStore();
  const router = useRouter();

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          logOut();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
    </TouchableOpacity>
  );
}
  // Deleted: LogoutButton component removed for Clerk integration.
