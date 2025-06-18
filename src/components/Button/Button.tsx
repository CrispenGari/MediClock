import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  variant?: "ghost" | "filled" | "outline";
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  color?: string;
  indicatorColor?: string;
  disabled?: boolean;
}
const Button = ({
  onPress,
  title,
  variant = "filled",
  style,
  loading,
  titleStyle,
  color = COLORS.secondary,
  indicatorColor = COLORS.white,
  disabled,
}: Props) => {
  const { settings } = useSettingsStore();
  return (
    <TouchableOpacity
      onPress={async () => {
        if (settings.haptics) {
          await onImpact();
        }
        if (typeof onPress !== "undefined") {
          onPress();
        }
      }}
      disabled={loading || disabled}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          maxWidth: 300,
          backgroundColor: loading
            ? COLORS.gray100
            : variant === "filled"
              ? color
              : variant === "outline"
                ? COLORS.transparent
                : COLORS.tertiary,
          height: Platform.select({ android: 50, ios: 45 }),
          borderRadius: 999,
          borderWidth: 1,
          borderColor: loading ? COLORS.gray100 : color,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} size={"small"} />
      ) : (
        <Text
          style={[
            {
              fontFamily: FONTS.bold,
              color: COLORS.white,
              fontSize: 18,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
