module.exports = {
  expo: {
    name: "Medi Clock",
    slug: "mediclock",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mediclock",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
      EXPO_PUBLIC_CONVEX_SITE: process.env.EXPO_PUBLIC_CONVEX_SITE,
      CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    },
  },
};
