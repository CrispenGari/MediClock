import Button from "@/src/components/Button/Button";
import TextInput from "@/src/components/TextInput/TextInput";
import { COLORS, FONTS } from "@/src/constants";
import { useWarmUpBrowser } from "@/src/hooks";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();
const Page = () => {
  useWarmUpBrowser();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState({
    error: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    loading: false,
    pendingResetPassword: false,
    code: "",
  });
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  React.useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  React.useEffect(() => {
    if (!!email) {
      setState((s) => ({ ...s, email: email }));
    }
  }, [email]);

  const onRequestCode = async () => {
    if (settings.haptics) {
      await onImpact();
    }

    if (!isLoaded) return;
    setState((state) => ({
      ...state,
      loading: true,
      error: "",
    }));

    await signIn
      .create({
        strategy: "reset_password_email_code",
        identifier: state.email.trim(),
      })
      .then((_) => {
        setState((s) => ({
          ...s,
          pendingResetPassword: true,
          loading: false,
          error: "",
        }));
      })
      .catch((err) => {
        if (err.errors) {
          const [error] = err.errors;
          setState((s) => ({
            ...s,
            error: error.longMessage,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            error: "Failed to reset account password.",
            loading: false,
          }));
        }
      })
      .finally(() => {
        setState((s) => ({ ...s, loading: false }));
      });
  };

  const resetPassword = async () => {
    if (!isLoaded) return;
    setState((state) => ({
      ...state,
      loading: true,
      error: "",
    }));

    if (state.password.trim() !== state.confirmPassword.trim()) {
      return setState((state) => ({
        ...state,
        loading: false,
        error: "The two passwords must match.",
      }));
    }

    await signIn
      .attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: state.code.trim(),
        password: state.password,
      })
      .then((result) => {
        if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setState((s) => ({
            ...s,
            error: "",
            loading: false,
            pendingResetPassword: false,
          }));
        }
      })
      .catch((err) => {
        if (err.errors) {
          const [error] = err.errors;
          setState((s) => ({
            ...s,
            error: error.longMessage,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            error: "Failed to reset account password.",
            loading: false,
          }));
        }
      })
      .finally(() => {
        setState((s) => ({ ...s, loading: false }));
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.main,
      }}
    >
      <Modal
        isVisible={state.pendingResetPassword}
        onBackdropPress={() =>
          setState((s) => ({ ...s, pendingResetPassword: false }))
        }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

            <TextInput
              label="Password"
              placeholder="Password"
              onChangeText={(text) =>
                setState((s) => ({ ...s, password: text }))
              }
              text={state.password}
              outerContainerStyles={{
                marginVertical: 10,
              }}
              secureTextEntry={!state.showPassword}
              leftIcon={
                <Ionicons name="lock-closed" color={COLORS.gray200} size={20} />
              }
            />

            <TextInput
              label="Confirm Password"
              placeholder="Confirm Password"
              onChangeText={(text) =>
                setState((s) => ({ ...s, confirmPassword: text }))
              }
              text={state.confirmPassword}
              outerContainerStyles={{
                marginVertical: 10,
              }}
              secureTextEntry={!state.showPassword}
              leftIcon={
                <Ionicons name="lock-closed" color={COLORS.gray200} size={20} />
              }
              onSubmitEditing={resetPassword}
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
                title="Change Password"
                onPress={resetPassword}
                loading={state.loading}
                style={{
                  width: "100%",
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
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
              Forgot Password
            </Text>
            <Animated.Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
                color: COLORS.gray200,
              }}
            >
              Please reset your password!
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
              title="Request Password Reset"
              onPress={onRequestCode}
              loading={state.loading}
            />
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
