import { APP_NAME, COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Footer = () => {
  const { settings } = useSettingsStore();
  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          marginBottom: 20,
          fontSize: 16,
          textAlign: "center",
          fontFamily: FONTS.bold,
          color: COLORS.black,
        }}
      >
        By using {APP_NAME} you are automatically accepting{" "}
        <Text
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.push("/(common)/tnc");
          }}
          style={styles.clickable_text}
        >
          Terms and Conditions
        </Text>{" "}
        and{" "}
        <Text
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.push("/(common)/pp");
          }}
          style={styles.clickable_text}
        >
          Privacy Policy
        </Text>{" "}
        of this app.
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  clickable_text: {
    color: COLORS.secondary,
    fontFamily: FONTS.bold,
    textDecorationLine: "underline",
  },
});
