import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Color } from "../helper/Color";
import { AntDesign } from "@expo/vector-icons";
import style from "../helper/Styles";

const CustomAlertModal = ({
  visible,
  message,
  title,
  buttonOptions = [],
  onClose,
  subTitle,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={style.modalHeader}>
            <Text style={style.modalTitle}>{title || "Error"}</Text>
            {onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.modalContent}>
            {message && <Text style={styles.modalText}>{message}</Text>}
            {subTitle && (
              <>
                <Text style={styles.modalText}>{subTitle}</Text>
                <View style={styles.separator} />
              </>
            )}
          </View>
          <View style={styles.modalFooter}>
            {buttonOptions.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, styles.buttonHalf]}
                onPress={button.onPress}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    width: "90%",
    backgroundColor: Color.WHITE,
    borderRadius: 5,
    padding: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalHeader: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Color.RED,
  },
  separator: {
    height: 1,
    backgroundColor: Color.LIGHT_GREY,
    marginVertical: 5,
    width: "100%",
  },
  modalContent: {
    justifyContent: "center",
  },
  modalText: {
    textAlign: "left",
    padding: 10,
  },
  modalFooter: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    top: 5,
  },
  buttonHalf: {
    flex: 1,
    marginHorizontal: 1,
  },
  button: {
    backgroundColor: Color.BLUE,
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Color.WHITE,
    fontSize: 16,
  },
});

export default CustomAlertModal;
