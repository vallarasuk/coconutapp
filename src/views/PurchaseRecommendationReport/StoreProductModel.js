import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView
} from "react-native";
import Currency from "../../lib/Currency";
import Order from "../../helper/Order";
import { Color } from "../../helper/Color";
import styles from "../../helper/Styles";
import Tab from "../../components/Tab";
import TabName from '../../helper/Tab';
import VerticalSpace10 from "../../components/VerticleSpace10";

export const StoreProductModel = (props) => {
  const { selectedProduct, closeModal } = props;

  const [activeTab, setActiveTab] = useState(TabName.PRODUCT);


  return (
    <>
      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        transparent={true}>
        <View style={[styles.tabBar,{marginTop:60}]}>
          <>
            <Tab
              title={
                [
                    {
                        title: TabName.PRODUCT,
                        tabName: TabName.PRODUCT
                    },
                    {
                        title: TabName.LOCATION,
                        tabName: TabName.LOCATION
                    },
                ]
            }
            setActiveTab={setActiveTab}
            defaultTab={activeTab}
            />
          </>
        </View>
        {selectedProduct && (
          <View style={activeTab === TabName.PRODUCT ? styles.storeProductModalContainer : styles.storeTable}>
            {activeTab === TabName.PRODUCT && (
              <View>
                <Image
                  source={{ uri: selectedProduct?.image }}
                  style={styles.modalImage}
                />
              </View>
            )}
            {selectedProduct?.brand_name && activeTab === TabName.PRODUCT ? (
              <Text style={{ fontWeight: "700" }}>
                {selectedProduct?.brand_name}
              </Text>
            ) : (
              ""
            )}
            {activeTab === TabName.PRODUCT && (
              <>
                <View style={{ flexDirection: "row" }}>
                  <Text style={[styles.cartText]}>
                    {selectedProduct?.product_name}
                    {selectedProduct?.size ? ", " + selectedProduct?.size : ""}
                    {selectedProduct?.unit}
                    {selectedProduct?.pack_size
                      ? `(Pack Size: ${selectedProduct?.pack_size
                        ? selectedProduct?.pack_size
                        : " "
                      })`
                      : ""}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {selectedProduct?.sale_price ? (
                    selectedProduct?.mrp != selectedProduct?.sale_price &&
                      selectedProduct?.mrp > 0 ? (
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ textDecorationLine: "line-through" }}>
                          {Currency.IndianFormat(selectedProduct?.mrp)}
                        </Text>
                        {selectedProduct?.mrp > 0 &&
                          selectedProduct?.mrp != selectedProduct?.sale_price ? (
                          <Text style={{ paddingLeft: 10, fontWeight: "bold" }}>
                            {Currency.IndianFormat(selectedProduct?.sale_price)}
                          </Text>
                        ) : (
                          ""
                        )}
                      </View>
                    ) : (
                      <Text>
                        {Currency.IndianFormat(selectedProduct?.sale_price)}
                      </Text>
                    )
                  ) : (
                    <Text>{Currency.IndianFormat(selectedProduct?.mrp)}</Text>
                  )}
                  {selectedProduct?.status && (
                    <Text
                      style={{
                        color:
                          selectedProduct?.status === Order.STATUS_CANCEL
                            ? Color.RED
                            : Color.SECONDARY
                      }}>{` (${selectedProduct?.status})`}</Text>
                  )}
                </View>
              </>
            )}
            {activeTab === TabName.LOCATION && (
              <View>
              <View style={{ height: "90%" }}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCellHeader]}>
                    <Text style={styles.tableCellHeaderText}>Name</Text>
                  </View>
                  <View style={styles.tableCellHeader}>
                    <Text style={styles.tableCellHeaderText}>Quantity</Text>
                  </View>
                </View>
                <ScrollView >
                  <FlatList
                    data={selectedProduct.storeProductData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.tableRow}>
                        <View style={styles.swipeStyle}>
                          <Text style={styles.tableCellText}>
                            {item.storeName}
                          </Text>
                        </View>
                        <View style={styles.tableCellText}>
                          {item.quantity < item.minQuantity ? (
                            <Text style={styles.colorText}>
                              {item.quantity}
                            </Text>
                          ) : (
                            <Text>{item.quantity}</Text>
                          )}
                        </View>
                      </View>
                    )}
                  />
                </ScrollView>
                <VerticalSpace10 />
                <VerticalSpace10 />


              </View>
              <View style={styles.align}>
              <Text
                style={
                  styles.letter
                }
              >
                Total Quantity:&nbsp;&nbsp;
                <Text style={styles.letterColor}>
                 { parseFloat(selectedProduct?.total_quantity)}
                </Text>
              </Text>
            </View> 
              </View>

            )}
          </View>
        )}
        {activeTab === TabName.PRODUCT && (
          <TouchableOpacity
            style={styles.productModalCloseButton}
            onPress={closeModal}>
            <Text style={styles.ProductModelCloseButtonText}>Close</Text>
          </TouchableOpacity>
        )}
      </Modal>
    </>
  );
};
