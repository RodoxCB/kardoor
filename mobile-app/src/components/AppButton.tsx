import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { palette, spacing } from "../theme";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  style?: ViewStyle;
};

const AppButton = ({ title, onPress, loading, disabled, variant = "primary", style }: AppButtonProps) => {
  const isGhost = variant === "ghost";
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, isGhost && styles.ghostText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.lg,
    alignItems: "center",
    backgroundColor: palette.primary,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ghost: {
    backgroundColor: palette.primaryDark,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: palette.border,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
  },
  ghostText: {
    color: palette.text,
  },
});

export default AppButton;
