import { api } from "@/convex/_generated/api";
import { TUser } from "@/convex/tables/users";
import HomeHeader from "@/src/components/Headers/HomeHeader";
import { COLORS } from "@/src/constants";
import { useMeStore } from "@/src/store/meStore";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";

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
        .then((res: { me: TUser | null }) => {
          if (res?.me) {
            save({
              _id: res.me._id,
              firstName: res.me.firstName,
              lastName: res.me.lastName,
              id: res.me.id,
              image: res.me.image,
              email: res.me.email,
            });
          }
        })
        .catch((error) => {
          console.error("Error saving user:", error);
        });
    }
  }, [me, user]);

  console.log({ me });
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.tertiary,
          elevation: 0,
          width: "100%",
          maxWidth: 300,
          bottom: 30,
          alignSelf: "center",
          borderRadius: 999,
          justifyContent: "center",
          height: 50,
          paddingTop: 5,
        },
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: COLORS.tertiary,
        tabBarActiveTintColor: COLORS.secondary,
        headerShown: true,
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarBackground: () => (
          <BlurView
            tint="extraLight"
            intensity={100}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: 999, overflow: "hidden" },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="pills" size={size} color={color} />
          ),
          header(props) {
            return <HomeHeader {...props} />;
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => {
            if (!!!me?.image) {
              return (
                <Ionicons
                  name="person-circle-outline"
                  color={color}
                  size={size}
                />
              );
            }
            return (
              <Image
                source={{ uri: me.image }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: focused ? COLORS.secondary : COLORS.transparent,
                }}
              />
            );
          },

          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
