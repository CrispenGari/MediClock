import React from "react";
import { ScrollView } from "react-native";

const Page = () => {
  return (
    <ScrollView
      style={{ flex: 1, padding: 20 }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    ></ScrollView>
  );
};

export default Page;
