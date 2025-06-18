import * as Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import * as StoreReview from "expo-store-review";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

export const onImpact = async () =>
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

export const rateApp = async () => {
  const available = await StoreReview.isAvailableAsync();
  if (available) {
    const hasAction = await StoreReview.hasAction();
    if (hasAction) {
      await StoreReview.requestReview();
    }
  }
};
export const onFetchUpdateAsync = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    Alert.alert(
      Constants.default.name,
      error as any,
      [{ text: "OK", style: "destructive" }],
      { cancelable: false }
    );
  }
};
