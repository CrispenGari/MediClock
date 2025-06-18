import Button from "@/src/components/Button/Button";
import Divider from "@/src/components/Divider/Divider";
import TextInput from "@/src/components/TextInput/TextInput";
import { APP_NAME, COLORS, FONTS } from "@/src/constants";
import { useWarmUpBrowser } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Link, router } from "expo-router";
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
import Modal from "react-native-modal";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();
const Page = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    error: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    showPassword: false,
    loading: false,
    pendingVerification: false,
    code: "",
  });

  const onSignUp = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!isLoaded) return;
    setState((state) => ({
      ...state,
      loading: true,
      error: "",
    }));

    try {
      if (state.firstName.trim().length < 3) {
        return setState((state) => ({
          ...state,
          loading: false,
          error: "First name must be at least 3 characters long.",
        }));
      }
      if (state.lastName.trim().length < 3) {
        return setState((state) => ({
          ...state,
          loading: false,
          error: "Last name must be at least 3 characters long.",
        }));
      }
      await signUp.create({
        emailAddress: state.email,
        password: state.password,
        firstName: state.firstName.trim(),
        lastName: state.lastName.trim(),
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setState((state) => ({
        ...state,
        loading: false,
        pendingVerification: true,
        error: "",
      }));
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error: error.long_message,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,

          error: "Failed to create an account.",
          loading: false,
        }));
      }
    } finally {
      setState((s) => ({
        ...s,
        loading: false,
      }));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setState((state) => ({
      ...state,
      loading: true,
      error: "",
    }));
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: state.code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error: "",
          pendingVerification: false,
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          code: "",
          showPassword: false,
        }));

        router.replace({
          pathname: "/",
        });
      } else {
        setState((s) => ({
          ...s,
          error: "Failed to verify your account try again.",
          loading: false,
          code: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error: error.long_message,
          loading: false,
          code: "",
        }));
      } else {
        setState((s) => ({
          ...s,
          error: "Failed to verify your account try again.",
          loading: false,
          code: "",
        }));
      }
    } finally {
      setState((s) => ({ ...s, loading: false, code: "" }));
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
        redirectUrl: Linking.createURL("/", { scheme: "mediclock" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setState((state) => ({
          ...state,
          loading: false,
          error: "",
          pendingVerification: false,
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          code: "",
          showPassword: false,
        }));
      } else {
        setState((state) => ({
          ...state,
          loading: false,
          error: "",
        }));
      }
    } catch (err: any) {
      if (err.errors) {
        const [error] = err.errors;
        setState((s) => ({
          ...s,
          error: error.long_message,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          error: "Failed to create an account.",
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
      <Modal
        isVisible={state.pendingVerification}
        onBackdropPress={Keyboard.dismiss}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              backgroundColor: COLORS.main,
              padding: 20,
              width: "100%",
              maxWidth: 450,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 20,
              }}
            >
              Verify Email
            </Text>

            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 14,
                color: COLORS.tertiary,
              }}
            >
              Verification code was sent to {state.email}.
            </Text>
            <TextInput
              label="Verification Code"
              placeholder="000000"
              onChangeText={(text) =>
                setState((s) => ({ ...s, code: text, error: "" }))
              }
              text={state.code}
              outerContainerStyles={{
                marginVertical: 10,
              }}
              leftIcon={
                <Ionicons name="key" color={COLORS.gray200} size={20} />
              }
              keyboardType="name-phone-pad"
            />
            <View style={styles.row}>
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
                title="Verify"
                onPress={onVerifyPress}
                loading={state.loading}
                style={{
                  width: "100%",
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{
            flex: 1,
          }}
          bounces={false}
        >
          <View style={{ padding: 20, paddingTop: 40 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 25 }}>
              Sign Up
            </Text>
            <Animated.Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                color: COLORS.gray200,
              }}
            >
              Hello, Welcome to {APP_NAME}!
            </Animated.Text>
          </View>
          <View style={styles.row}>
            <TextInput
              label="First Name"
              placeholder="e.g. John"
              onChangeText={(text) =>
                setState((s) => ({ ...s, firstName: text }))
              }
              text={state.firstName}
              outerContainerStyles={{
                flex: 1,
              }}
              leftIcon={
                <Ionicons name="person" color={COLORS.gray200} size={20} />
              }
            />
            <TextInput
              label="Last Name"
              placeholder="e.g. Doe"
              onChangeText={(text) =>
                setState((s) => ({ ...s, lastName: text }))
              }
              text={state.lastName}
              outerContainerStyles={{
                flex: 1,
              }}
              leftIcon={
                <Ionicons name="person" color={COLORS.gray200} size={20} />
              }
            />
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
              onSubmitEditing={onSignUp}
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
              title="Sign Up"
              onPress={onSignUp}
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
                Sign Up with Google
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
            <Link href="/(auth)/sign-in" asChild>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  color: COLORS.gray200,
                }}
              >
                Already have an account?{" "}
                <Text
                  style={{
                    color: COLORS.primary,
                  }}
                >
                  Sign In.
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
