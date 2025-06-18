import { api } from "@/convex/_generated/api";
import { COLORS, FONTS } from "@/src/constants";
import { useMeStore } from "@/src/store/meStore";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

const Layout = () => {
  const { me, save } = useMeStore();
  const { user } = useUser();
  const mutateSaveUser = useMutation(api.api.users.findUserOrCreateOne);
  React.useEffect(() => {
    if (!!!me && !!user) {
      mutateSaveUser({
        id: user.id,
        firstName: user.firstName!,
        lastName: user.lastName!,
        image: user.imageUrl || "",
        email: user.emailAddresses[0].emailAddress,
      })
        .then((res) => {
          if (res?.me) {
            save(res.me);
          }
        })
        .catch((error) => {
          console.error("Error saving user:", error);
        });
    }
  }, [me, user]);

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          height:
            width >= 600 ? 70 : Platform.select({ ios: 100, android: 80 }),
          backgroundColor: COLORS.transparent,
          position: "absolute",
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarActiveTintColor: COLORS.secondary,
        headerShown: true,
        tabBarLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: 12,
          marginTop: width >= 600 ? 10 : 0,
        },
        // tabBarBackground: () => (
        //   <BlurView
        //     tint="light"
        //     intensity={100}
        //     style={StyleSheet.absoluteFill}
        //   />
        // ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
