import React from "react";
import { View, Modal, Text, TouchableOpacity, Image } from "react-native";
import Currency from "../lib/Currency";
import Order from "../helper/Order";
import { Color } from "../helper/Color";
import styles from "../helper/Styles";
import { AntDesign } from '@expo/vector-icons';

export const ProductModel = (props) => {
  const { selectedProduct, closeModal, image } = props;
  return (
    <>
      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        transparent={true}
      >
        <>
          {selectedProduct && (
            <>
          
            <View style={[styles.productModalContainer]}>
            <TouchableOpacity
                  style={styles.modalStyle}
                  onPress={closeModal} 
                >
                  <AntDesign name="close" size={34} color="black" />
                </TouchableOpacity>
           
                <View>
                  <Image
                    source={{ uri: image }}
                    style={{ width: "90%", aspectRatio: 1 }} />
                </View>
                <View style = {styles.textWidth}>
                  {selectedProduct?.brand_name ? (
                    <Text style={styles.productModal}>
                      {selectedProduct?.brand_name}
                    </Text>
                  ) : (
                    ""
                  )}
                  <View style={styles.direction}>
                    <Text style={[styles.cartText]}>
                      {selectedProduct?.product_name}
                      {selectedProduct?.size ? ", " + selectedProduct?.size : ""}
                      {selectedProduct?.unit}
                      {selectedProduct?.pack_size
                        ? `(Pack Size: ${selectedProduct?.pack_size
                          ? selectedProduct?.pack_size
                          : " "})`
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.direction}>
                    {selectedProduct?.sale_price ? (
                      selectedProduct?.mrp != selectedProduct?.sale_price &&
                        selectedProduct?.mrp > 0 ? (
                        <View style={styles.direction}>
                          <Text style={styles.modalText}>
                            {Currency.IndianFormat(selectedProduct?.mrp)}
                          </Text>
                          {selectedProduct?.mrp > 0 &&
                            selectedProduct?.mrp != selectedProduct?.sale_price ? (
                            <Text style={styles.priceText}>
                              {Currency.IndianFormat(selectedProduct?.sale_price)}
                            </Text>
                          ) : (
                            ""
                          )}
                        </View>
                      ) : (
                        <Text style={styles.fontSize}>
                          {Currency.IndianFormat(selectedProduct?.sale_price)}
                        </Text>
                      )
                    ) : (
                      <Text style={styles.fontSize}>{Currency.IndianFormat(selectedProduct?.mrp)}</Text>
                    )}
                    {selectedProduct?.status && (
                      <Text
                        style={{
                          color: selectedProduct?.status === Order.STATUS_CANCEL
                            ? Color.RED
                            : Color.SECONDARY
                        }}
                      >{` (${selectedProduct?.status})`}</Text>
                    )}
                  </View>
                </View>
              </View></>
          )}
        </>
      </Modal>
    </>
  );
};
