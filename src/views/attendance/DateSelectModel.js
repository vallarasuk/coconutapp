import React, { useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Color } from "../../helper/Color";
import { useForm } from "react-hook-form";

function DateSelectModel({
  toggle,
  MediaData,
  modalVisible,
  dateAndTime,
  button2Press,
  handlePaymentChange,
  button1Press,
  content,
  content2,
  button1Label,
  button2Label,
  disable,
  label,
  title,
  selectedPayment,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000099",
    },
    modalContainer: {
      width: "80%",
      height: 450,
      borderRadius: 5,
      backgroundColor: "#f9fafb",
    },
    modalHeader: {
      flex: 0.3,
      justifyContent: "center",
    },
    modalBody: {
      flex: handlePaymentChange ? 0.8 : 0.6,
      backgroundColor: "#fff",
      paddingVertical: 20,
      paddingHorizontal: 10,
      justifyContent: "center",
      alignItems: "center",
      justifyContent: "center",

    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      padding: 15,
      color: Color.BLACK,
      display: "flex",
      justifyContent: "center",
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: "lightgray",
    },
    actions: {
      borderRadius: 5,
      marginHorizontal: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#db2828",
    },
    actionText: {
      color: "#fff",
    },
    imageStyle: {
      flex: 1,
      flexDirection: "row",
    },
    closeButton: {
      position: "absolute",
      top: 17,
      right: 10,
      width: 25,
      height: 25,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        toggle && toggle();
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={() => toggle && toggle()}
              style={styles.closeButton}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.modalBody}>
            {dateAndTime && (
              <View style={{ flex: 1, width: "100%", paddingTop: 20 }}>
                {dateAndTime}
              </View>
            )}
            
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DateSelectModel;
