import "dotenv/config";

export default {
  expo: {
    name: "coconut-app",
    slug: "coconut-app",
    version: "1.0.0",
    assetBundlePatterns: ["**/*"],
    plugins: [
      [
        "expo-notifications",
        {
          sounds: ["./src/assets/audio/message.mp3"],
        },
      ],
      "expo-image-picker",
      "react-native-background-fetch",
    ],
    extra: {
      eas: {
        projectId: "f4a2ff01-75fd-4b2b-93f1-fc543149a492",
      },
    },
    owner: "vallarasu_kanthasamy",
    platforms: {
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#FFFFFF",
        },
      },
      web: {
        favicon: "./assets/favicon.png",
      },
    },
    description: "Your app description here",
    icon: "./assets/icon.png",
  },
};
