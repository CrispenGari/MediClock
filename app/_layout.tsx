import "react-native-reanimated";
///
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { loadAsync } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Fonts } from "@/src/constants";
import ClerkProvider from "@/src/providers/ClerkProvider";
import ConvexProvider from "@/src/providers/ConvexProvider";
import Constants from "expo-constants";
LogBox.ignoreLogs;
LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

const Layout = () => {
  const keys = React.useMemo(
    () =>
      [
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_URL,
        Constants.expoConfig?.extra?.CONVEX_DEPLOYMENT,
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_SITE,
        Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      ].filter(Boolean),
    []
  );

  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await loadAsync(Fonts);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  if (keys.length !== 4)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Missing {keys.length - 4} keys.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <ConvexProvider>
        <ClerkProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <RootLayout />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ClerkProvider>
      </ConvexProvider>
    </View>
  );
};

export default Layout;

const RootLayout = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};
