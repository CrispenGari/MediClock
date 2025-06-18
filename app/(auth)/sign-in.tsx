import Button from "@/src/components/Button/Button";
import Divider from "@/src/components/Divider/Divider";
import TextInput from "@/src/components/TextInput/TextInput";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

import { useWarmUpBrowser } from "@/src/hooks";
import { useSSO, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();
const Page = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const { isLoaded } = useUser();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    error: "",
    email: "",
    password: "",
    showPassword: false,
    loading: false,
  });

  const onSignIn = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  const google = React.useCallback(async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;

    setState((state) => ({
      ...state,
      loading: true,
    }));
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/", { scheme: "peermart" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
        }));
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error_msg: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error_msg: error.message,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,

          error_msg: "Failed to create an account.",
          loading: false,
        }));
      }
    }
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.main,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{
            flex: 1,
          }}
          bounces={false}
        >
          <View style={{ padding: 20, paddingTop: 40 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
              Sign In
            </Text>
            <Animated.Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                color: COLORS.gray200,
              }}
            >
              Hello, Welcome back!
            </Animated.Text>
          </View>

          <View style={styles.row}>
            <TextInput
              label="Email Address"
              placeholder="e.g. johndoe@gmail.com"
              onChangeText={(text) => setState((s) => ({ ...s, email: text }))}
              text={state.email}
              outerContainerStyles={{
                flex: 1,
              }}
              leftIcon={
                <Ionicons name="mail" color={COLORS.gray200} size={20} />
              }
            />
          </View>
          <View style={styles.row}>
            <TextInput
              label="Password"
              placeholder="Password"
              onChangeText={(text) =>
                setState((s) => ({ ...s, password: text }))
              }
              text={state.password}
              outerContainerStyles={{
                flex: 1,
              }}
              secureTextEntry={!state.showPassword}
              leftIcon={
                <Ionicons name="lock-closed" color={COLORS.gray200} size={20} />
              }
              rightIcon={
                <Ionicons
                  name={state.showPassword ? "eye" : "eye-off"}
                  color={COLORS.gray200}
                  size={20}
                />
              }
              onRightIconPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                setState((s) => ({
                  ...s,
                  showPassword: !s.showPassword,
                }));
              }}
              onSubmitEditing={onSignIn}
            />
          </View>
          <View
            style={[
              styles.row,
              { justifyContent: "flex-start", width: "100%" },
            ]}
          >
            <Text
              style={{
                color: COLORS.red,
                marginTop: 10,
                fontFamily: FONTS.regular,
                fontSize: 16,
              }}
            >
              {state.error}
            </Text>
          </View>

          <View style={styles.row}>
            <Button
              style={{
                width: "100%",
                maxWidth: 450,
                marginVertical: 10,
              }}
              title="Sign In"
              onPress={onSignIn}
              loading={state.loading}
            />
          </View>
          <View style={[styles.row, { marginVertical: 20 }]}>
            <Divider
              position="center"
              title="OR"
              titleStyles={{ color: COLORS.gray200 }}
            />
          </View>
          <View style={[styles.row, { marginVertical: 20 }]}>
            <TouchableOpacity
              disabled={state.loading}
              activeOpacity={0.7}
              style={[
                styles.btn,
                {
                  elevation: 0,
                  borderColor: COLORS.google,
                },
              ]}
              onPress={google}
            >
              <Image
                source={require("../../assets/images/google.png")}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: COLORS.black,
                  fontSize: 18,
                }}
              >
                Sign In with Google
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.row,
              {
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              },
            ]}
          >
            <Link href="/(auth)/sign-up" asChild>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  color: COLORS.gray200,
                }}
              >
                Don't have an account?{" "}
                <Text
                  style={{
                    color: COLORS.primary,
                  }}
                >
                  Sign Up.
                </Text>
              </Text>
            </Link>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Page;

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingHorizontal: 20,
    alignSelf: "center",
    maxWidth: 450,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    width: "100%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
});
