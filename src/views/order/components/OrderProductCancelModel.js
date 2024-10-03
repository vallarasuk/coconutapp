import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import { Color } from "../../../helper/Color";
import AlertMessage from "../../../helper/AlertMessage";
import ProductCard from "../../../components/ProductCard";
import TextInput from "../../../components/TextInput";
import { verticalScale } from "../../../components/Metrics";
function OrderProductCancelModel({
  toggle,
  modalVisible,
  CancelAction,
  item,
  updateAction,
  heading,
  description,
  control,
  onReasonInput,
}) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        toggle && toggle();
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.cancelModalContainer,
            keyboardVisible && styles.keyboardVisible,
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.title}>
              {heading ? heading : "Confirm Delete"}{" "}
            </Text>
          </View>

          <View style={styles.divider}></View>

          <View style={styles.modalBody}>
            <View style={{ paddingHorizontal: 10 }}>
              <Text>
                {description
                  ? description
                  : AlertMessage.CANCEL_MODAL_DESCRIPTION}
              </Text>
            </View>
            {item && (
              <ProductCard
                name={item?.name || item?.product_name}
                brand={item.brand_name}
                mrp={item.mrp}
                sale_price={item.sale_price}
                image={item.image}
                noIcon
              />
            )}
            <View style={{ paddingHorizontal: 10 }}>
              <TextInput
                title={"Reason"}
                name="reason"
                placeholder="Enter Reason"
                control={control}
                onInputChange={onReasonInput}
                multiline
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.modalFooter}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignItems: "center",
                  backgroundColor: Color.PRIMARY,
                  justifyContent: "center",
                  borderBottomLeftRadius: 5,
                }}
                onPress={() => {
                  toggle && toggle();
                  updateAction && updateAction(item);
                }}
              >
                <Text
                  style={{
                    color: Color.PRIMARY_TEXT,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  OK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignItems: "center",
                  backgroundColor: Color.SECONDARY,
                  justifyContent: "center",
                  borderBottomRightRadius: 4.7,
                }}
                onPress={() => {
                  toggle && toggle();
                  CancelAction && CancelAction();
                }}
              >
                <Text
                  style={{
                    color: Color.PRIMARY_TEXT,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default OrderProductCancelModel;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },

  cancelModalContainer: {
    width: "80%",
    height: verticalScale(500),
    borderRadius: 5,
    flex: 0.5,
    backgroundColor: "#f9fafb",
  },
  keyboardVisible: {
    flex: 0.7,
  },
  modalHeader: {
    flex: 0.2,
    justifyContent: "center",
  },
  modalBody: {
    flex: 0.6,
    backgroundColor: "#fff",
    paddingVertical: 5,
    justifyContent: "center",
  },
  modalFooter: {
    flex: 0.2,
  },
  title: {
    fontWeight: "bold",
    paddingHorizontal: 15,
    color: Color.BLACK,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
});
