import { COLORS } from "@/src/constants";
import { useMeStore } from "@/src/store/meStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { StackActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeHeader = ({ navigation }: BottomTabHeaderProps) => {
  const { isLoaded, signOut } = useAuth();
  const { destroy } = useMeStore();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const logout = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;
    await signOut().finally(() => {
      destroy();
      navigation.dispatch(StackActions.popToTop());
      setTimeout(() => {
        router.replace({
          pathname: "/",
        });
      }, 0);
    });
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: COLORS.primary, paddingHorizontal: 20 }}
    >
      <TouchableOpacity
        hitSlop={10}
        onPress={logout}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-end",
          width: 35,
          height: 35,
          backgroundColor: COLORS.gray100,
          borderRadius: 35,
          justifyContent: "center",
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <MaterialIcons name="logout" size={20} color={COLORS.secondary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeHeader;
