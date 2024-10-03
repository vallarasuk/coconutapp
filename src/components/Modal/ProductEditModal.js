import React, { useState } from 'react';

import { Modal, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import QuantityButton from "../../components/Quantity/index";

import ImageCard from "../ImageCard";

import Currency from "../../lib/Currency";
import { Color } from '../../helper/Color';

import { AntDesign } from '@expo/vector-icons';
import VerticalSpace10 from '../VerticleSpace10';
import TextInput from '../TextInput';
import { ScrollView } from 'react-native';
import CurrencyInput from "../../components/Currency";
import { verticalScale } from "../../components/Metrics";
import style from '../../helper/Styles';

function ProductEditModal({ toggle, modalVisible, title,mrp, control,onMrpChange,mrpField, BottonLabel1, TextBoxQuantityField, CancelAction, item, updateAction, content,setSelectedItem }) {
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const quantityOnChange = (value) => {
        setSelectedItem && setSelectedItem((prevValues) => ({
            ...prevValues,
            quantity: value,
          }));
        setSelectedQuantity(value)
    }
    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                toggle && toggle();
            }}>
            <View style={styles.ProductEditContainer}>

                <View style={content ? styles.ProductEditModalHeight : styles.ProductEditModalContainer}>

                    <View style={style.modalHeader}>
                        <Text style={style.modalTitle}>{title ? title : "Edit Quantity"}</Text>
                        <TouchableOpacity onPress={() => {toggle && toggle();  setSelectedQuantity("");}} style={styles.ModalCloseButton}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ProductEditDivider}></View>

                    <View style={content ? styles.ProductEditModalBody : styles.ProductEditModal}>

                        {item && (
                            <View style={styles.productEditImageStyle}>
                                <View >
                                    <ImageCard ImageUrl={item.image ? item.image : item.featured_media_url} />
                                </View>

                                <View style={{ flex: 1 }}>

                                    {(item.brand || item.brand_name) && <Text style={{ fontWeight: "700" }}>{item.brand ? item.brand : item?.brand_name}</Text>}

                                    <View style={styles.direction}>
                                        <Text style={{
                                            fontSize: 16,
                                            textTransform: "capitalize",
                                        }}>
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

                        {!TextBoxQuantityField && (

                            <View style={styles.ProductEditQuantity}>
                                <QuantityButton quantityOnChange={quantityOnChange} quantity={item?.quantity} />

                            </View>
                        )}
                  <ScrollView style={styles.width}>

                        {TextBoxQuantityField && (
                            <View >
                                <><TextInput name="quantity" keyboardType="numeric" title="Quantity" values={item.quantity ? item.quantity.toString() : ""} onInputChange={quantityOnChange} control={control} />
                                    <VerticalSpace10 />
                                </>
                            </View>
                        )}
                        {mrpField && (
                           
                       <CurrencyInput
                        title="MRP"
                        name="mrp"
                        control={control}
                        onInputChange={onMrpChange}
                        values = {mrp ? mrp.toString() : item.mrp}
                        edit
                    />
                       
                        )}
                        {content && (
                            <View style={[styles.ProductEditContent,{marginTop : 10}]}>
                                {content}
                            </View>
                        )}
                         </ScrollView>
                    </View>

                    <View style={styles.ProductEditDivider} />

                    <View style={content ? styles.ProductEditModalFooter : styles.ProductEditFooter}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity
                                style={{
                                    flex: CancelAction ? 0.5 : 1,
                                    backgroundColor: Color.PRIMARY,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    toggle && toggle();
                                    updateAction && updateAction(parseInt(selectedQuantity));
                                    setSelectedQuantity("");
                                }}
                            >
                                <Text style={{ color: Color.PRIMARY_BUTTON, fontSize: 15, fontWeight: "700" }}>
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

export default ProductEditModal;

const styles = StyleSheet.create({
    width : {
        paddingBottom: 5, width: '100%'
    },

ModalCloseButton: {
    position: 'absolute',
    top: 17,
    right: 10,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
},
  ProductEditContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00000099",
},

ProductEditModalHeight: {
    height: verticalScale(470),
    borderRadius: 5,
    backgroundColor: "#f9fafb",
    width: "80%",
},
ProductEditModalContainer: {
    width: "80%",
    height: verticalScale(350),
    borderRadius: 5,
    backgroundColor: "#f9fafb",
},
ProductEditContent: {
    flex: 1,
    width: "100%",
    paddingBottom: 5
},
ProductEditModalHeader: {
    flex: 0.4,
    justifyContent: "center",
},
ProductEditHeader: {
    flex: 0.3,
    justifyContent: "center",
},
ProductEditQuantity: {
    flex: 1,
    paddingTop: 18
},
ProductEditModalBody: {
    flex: 1.5,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around"
},
ProductEditModal: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-around"
},
ProductEditModalFooter: {
    flex: 0.2,
},
ProductEditFooter: {
    flex: 0.3,
},
ProductEditTitle: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 5,
    color: Color.BLACK
},
ProductEditDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray"
},
ProductEditActions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#db2828"
},
ProductEditActionText: {
    color: "#fff"
},
productEditImageStyle: {
    width: "110%",
    flexDirection: "row",
},
})
