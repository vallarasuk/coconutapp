import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Color } from "../../helper/Color";
import { AntDesign } from "@expo/vector-icons";
import ProductCard from "../ProductCard";
import CustomDivider from "../Divider";
import style from "../../helper/Styles";
import NoRecordFound from "../NoRecordFound";
import { SafeAreaView } from "react-native";

const ProductListModal = ({ visible, onClose, products }) => {
  return (
    <Modal
    transparent={true} 
    animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
          <SafeAreaView  style={styles.modalBackground}>

          <View style={styles.modalContent}>
          <View style={style.modalHeader}>
            <Text style={[style.modalTitle,style.swipeStyle,{textAlign : 'center'}]}>{"Products"}</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="closecircle" size={24} color="black" />
              </TouchableOpacity>
          </View>
          <View />
          {products && products.length > 0 ? (

          
          <FlatList
            data={products}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <>
              <CustomDivider/>
                <ProductCard
                  item={item}
                  image={item.image || item.featured_media_url}
                  name={item.product_name || item.product_display_name}
                  sale_price={item.sale_price}
                  mrp={item.mrp}
                  size={item.size}
                  unit={item.unit}
                  brand={item.brand || item.brand_name}
                  noIcon
                />
                <CustomDivider/>
              </>
            )}
          />
        ) : <NoRecordFound message = {"BarCode Not Found"} iconName="receipt"/> }

        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalHeader: {
        marginVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Color.BLACK,
      },
    modalBackground: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5, 
        height : "101%"
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },

      closeButtonText: {
        fontSize: 18,
        color: 'black',
      },
      divider: {
        width: '100%',
        backgroundColor: Color.LIGHT_GREY,
        marginVertical: 10,
      },
    });

export default ProductListModal;
