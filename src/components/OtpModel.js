import React, { useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet, Dimensions } from "react-native";
import Drawer from "./Drawer";
import Button from "./Button";

const OTPModal = (props) => {
  const { OTPmodalVisible, setOtpModalVisible,LoginByMobile, otpValue, setOtpValue } = props;

  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef()
  ];
  const [otpErrors, setOtpErrors] = useState([false, false, false, false]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);


  const windowHeight = Dimensions.get("window").height;

  const handleOTPChange = (text, index) => {
    const newErrors = [...otpErrors];
    newErrors[index] = false;
    setOtpErrors(newErrors);

    if (text.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }

    if (text.length === 1 && index === 3) {
      setShowErrorMessage(false);
      setOtpErrors([false, false, false, false]);
    }

    const updatedOtpValue = [...otpValue];
    updatedOtpValue[index] = text;
    setOtpValue(updatedOtpValue.join(""));

    if (updatedOtpValue.join("").length < 4) {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(false);
    }
  };

  const handleContinue = async () => {
    const hasErrors = otpErrors.some((error) => error);

    if (!hasErrors && otpValue.length == 4) {
      await LoginByMobile(otpValue);
    }
  };

  const handleBackspace = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      inputRefs[index - 1].current.focus();
      const updatedOtpValue = [...otpValue];
      updatedOtpValue[index - 1] = "";
      setOtpValue(updatedOtpValue.join(""));
    }
  };

  return (
    <Drawer
      height={windowHeight * 0.4}
      isOpen={OTPmodalVisible}
      closeDrawer={setOtpModalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.otpContainer, !showErrorMessage && { marginBottom: 40 }]}>
          {inputRefs.map((ref, index) => (
            <View key={index} style={{ alignItems: "center" }}>
              <TextInput
                ref={ref}
                style={[
                  styles.otpBox,
                  otpErrors[index] && !otpValue[index] && { borderColor: "red" }
                ]}
                onChangeText={(text) => handleOTPChange(text, index)}
                maxLength={1}
                onKeyPress={(event) => handleBackspace(event, index)}
                keyboardType="numeric"
                value={otpValue[index]}
              />
            </View>
          ))}
        </View>
        {showErrorMessage && (
          <Text
            style={{
              color: "red",
              marginTop: 10,
              marginBottom: 10,
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            Please enter all numbers
          </Text>
        )}
        <Button isDisabled={otpValue.length >3 ? false:true} title="Log In" onPress={handleContinue} />
      </View>
    </Drawer>
  );
};

export default OTPModal;


const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    margin: 5
  },
  otpBox: {
    width: 48,
    height: 52,
    backgroundColor: "#1A2229",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#4F6676",
    textAlign: "center",
    fontSize: 20,
    color: "#e9ecf3",
    margin: 3
  },
  modalContainer: {
    backgroundColor: "#242E36",
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  }
});