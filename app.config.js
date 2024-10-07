import 'dotenv/config';

export default {
  expo: {
    name: "coconut-app",
    slug: "coconut-app",
    version: "1.0.0",
    assetBundlePatterns: [
      "**/*"
    ],
    plugins: [
      [
        "expo-notifications",
        {
          "sounds": [
            "./src/assets/audio/message.mp3"
          ]
        }
      ],
      "expo-image-picker",
      "react-native-background-fetch"
    ],
    extra: {
      eas: {
        projectId: process.env.EXPO_PROJECT_ID
      }
    },
    owner: process.env.EXPO_OWNER
  }
};
require('dotenv').config();
