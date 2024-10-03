import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Color } from "../../../helper/Color";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import CurrencyInput from "../../../components/Currency";
import { verticalScale } from "../../../components/Metrics";
import ImageCard from "../../../components/ImageCard";
import Currency from "../../../lib/Currency";

function PriceUpdateModal({
  toggle,
  modalVisible,
  title,
  control,
  BottonLabel1,
  CancelAction,
  item,
  handleUpdate,
  content,
  price,
}) {
  const [manualPrice, setManualPrice] = useState("");
 
  useEffect(() => {
    if(!price)
   { setManualPrice("");
}
  }, []);

  const onPriceChange = (value) => {
    setManualPrice(value !== "" ? value : " ");
  };
   

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        toggle && toggle();
      }}
    >
      <View style={styles.PriceEditContainer}>
        <View
          style={
            content
              ? styles.PriceEditModalHeight
              : styles.PriceEditModalContainer
          }
        >
          <View
            style={
              content ? styles.PriceEditModalHeader : styles.PriceEditHeader
            }
          >
            <Text style={styles.PriceEditTitle}>
              {title ? title : "Edit Price"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                toggle && toggle();
              }}
              style={styles.ModalCloseButton}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.PriceEditDivider}></View>

          <View
            style={content ? styles.PriceEditModalBody : styles.PriceEditModal}
          >
            {item && (
              <View style={styles.priceEditImageStyle}>
                <View>
                  <ImageCard
                    ImageUrl={item.image ? item.image : item.featured_media_url}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  {(item.brand || item.brand_name) && (
                    <Text style={{ fontWeight: "700" }}>
                      {item.brand ? item.brand : item?.brand_name}
                    </Text>
                  )}

                  <View style={styles.direction}>
                    <Text
                      style={{
                        fontSize: 16,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.name ? item.name : item.product_name}
                      {item.size ? "," + item.size : ""}
                      {item.unit}
                    </Text>
                  </View>

                  <View style={styles.direction}>
                    {item.sale_price ? (
                      item.mrp != item.sale_price && item.mrp > 0 ? (
                        <View style={styles.direction}>
                          <Text style={{ textDecorationLine: "line-through" }}>
                            {Currency.IndianFormat(item.mrp)}
                          </Text>
                          {item.mrp > 0 && item.mrp != item.sale_price ? (
                            <Text style={{ paddingLeft: 10 }}>
                              {Currency.IndianFormat(item.sale_price)}
                            </Text>
                          ) : (
                            ""
                          )}
                        </View>
                      ) : (
                        <Text>{Currency.IndianFormat(item.sale_price)}</Text>
                      )
                    ) : (
                      <Text>{Currency.IndianFormat(item.mrp)}</Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            <ScrollView style={styles.width}>
              <View style={{ marginTop: 20}}>
                <CurrencyInput
                  title="Manual Price"
                  name="manualPrice"
                  control={control}
                  onInputChange={onPriceChange}
                  values={
                    manualPrice!==""
                      ? manualPrice.toString()
                      : item?.manual_price
                      ? item?.manual_price.toString()
                      : (item?.sale_price.toString() || item.price.toString())
                  }
                  edit
                />
              </View>

              {content && (
                <View style={[styles.PriceEditContent, { marginTop: 10 }]}>
                  {content}
                </View>
              )}
            </ScrollView>
          </View>

          <View style={styles.PriceEditDivider} />

          <View
            style={
              content ? styles.PriceEditModalFooter : styles.PriceEditFooter
            }
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: CancelAction ? 0.5 : 1,
                  backgroundColor: Color.PRIMARY,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  toggle && toggle();
                  handleUpdate && handleUpdate(manualPrice);
                }}
              >
                <Text
                  style={{
                    color: Color.PRIMARY_BUTTON,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  {BottonLabel1 ? BottonLabel1 : "UPDATE"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default PriceUpdateModal;

const styles = StyleSheet.create({
  width: {
    paddingBottom: 5,
    width: "100%",
  },

  ModalCloseButton: {
    position: "absolute",
    top: 17,
    right: 10,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  PriceEditContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },

  PriceEditModalHeight: {
    height: verticalScale(470),
    borderRadius: 5,
    backgroundColor: "#f9fafb",
    width: "80%",
  },
  PriceEditModalContainer: {
    width: "80%",
    height: verticalScale(350),
    borderRadius: 5,
    backgroundColor: "#f9fafb",
  },
  PriceEditContent: {
    flex: 1,
    width: "100%",
    paddingBottom: 5,
  },
  PriceEditModalHeader: {
    flex: 0.4,
    justifyContent: "center",
  },
  PriceEditHeader: {
    flex: 0.3,
    justifyContent: "center",
  },

  PriceEditModalBody: {
    flex: 1.5,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  PriceEditModal: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  PriceEditModalFooter: {
    flex: 0.2,
  },
  PriceEditFooter: {
    flex: 0.3,
  },
  PriceEditTitle: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 5,
    color: Color.BLACK,
  },
  PriceEditDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },

  priceEditImageStyle: {
    width: "110%",
    flexDirection: "row",
  },
});
