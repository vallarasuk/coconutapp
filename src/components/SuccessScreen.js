// SuccessScreen.js
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Color } from "../helper/Color";

const SuccessScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <FontAwesome5 name={"check"} size={50} color={Color.PRIMARY} />
        <Text style={styles.title}>You Have applied successfully</Text>
        <Text style={styles.description}>We will get touch with you shortly</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Home"
          onPress={() => navigation.navigate("Home")}
          color="#841584"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    color: "green",
    textAlign: "center",
    margin: 2,
  },
  description: {
    fontSize: 15,
    color: "#841584",
    textAlign: "center",
    margin: 2,
  },
  backToJobList: {
    marginTop: 20,
    fontSize: 18,
    color: "#841584",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
});

export default SuccessScreen;
