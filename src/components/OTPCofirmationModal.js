import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Color } from "../helper/Color";

const OTPCofirmationModal = (props) => {
  let { isOpen, onClose, onSubmit, setOTP, otp } = props;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleConfirm = () => {
    onSubmit(otp);
  };

  const handleClose = () => {
    onClose && onClose();
    setOTP("");
    setTimer(0);
  };

  const handleResendOTP = () => {
    setOTP("");  
    setTimer(120);
    props.handleResendOTP && props.handleResendOTP();
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
          </View>
          <View style={{ padding: 30 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter Verification Code"
              onChangeText={setOTP}
              keyboardType="numeric"
              maxLength={6}
              value={otp}  
            />
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend OTP in {timer} seconds</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              ...styles.buttonContainer,
              backgroundColor:
                otp && otp.length > 2 ? Color.PRIMARY : Color.SWITCH_GREY,
            }}
          >
            <TouchableOpacity
              disabled={otp && otp.length > 2 ? false : true}
              style={{
                flex: 1,
                backgroundColor:
                  otp && otp.length > 2 ? Color.PRIMARY : Color.SWITCH_GREY,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleConfirm}
            >
              <Text
                style={{
                  color: Color.PRIMARY_TEXT,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                VERIFY OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  resendLink: {
    color: 'blue',
    textAlign: 'right',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    width: "75%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    padding: 15,
    backgroundColor: Color.PRIMARY,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  header: {
    padding: 30,
    textAlign: "left",
    backgroundColor: "#f9fafb",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default OTPCofirmationModal;
