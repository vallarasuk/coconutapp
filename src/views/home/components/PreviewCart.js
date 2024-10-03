import React from "react";
import { Image, View, Text, Dimensions } from "react-native";
import ArrayList from "../../../lib/ArrayList";
import { Color } from "../../../helper/Color";
import NoProduct from '../../../assets/NoProduct.png';
import Button from '../../../components/Button';
import QuantityButton from '../../../components/QuantityButton';

const PreviewCart = ({ data, quantityOnChange, cartProductList, showQuantityOption }) => {

    const { width, height } = Dimensions.get('window');

    const CardElement = () => {

        let quantityObj = cartProductList && ArrayList.isNotEmpty(cartProductList) && cartProductList.find((cartData) => cartData.productId == data.product_id);

        return (
            <>
                <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
                    {!data.image ? (
                        <Image source={NoProduct} style={{
                            width: width * 0.25,
                            height: height * 0.13,
                        }} />
                    ) : (
                        <Image source={{ uri: data.image }} style={{
                            width: width * 0.25,
                            height: height * 0.13,
                            borderColor: Color.LIGHT_GRAY,
                            borderWidth: 1
                        }} />
                    )}
                </View>

                <View style={{ flex: 0.7, flexDirection: "column", justifyContent: showQuantityOption ? "space-around" : "flex-start" }}>

                    <View style={{ flexDirection: "column" }}>

                        <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: "bold" , marginTop: showQuantityOption ? 0 : 5 }}>{data.product_display_name}</Text>

                        {(data.sale_price && data.mrp) && (
                            <>
                                {data.sale_price == data.mrp ? (
                                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{`\u20B9${data.mrp}`}</Text>
                                ) : (
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ textDecorationLine: 'line-through', color: Color.LIGHT_GREY1 }}>{`\u20B9${data.mrp}`}</Text>
                                        <Text style={{ fontWeight: "bold", marginLeft: 5 }}>{`\u20B9${data.sale_price}`}</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>

                    {showQuantityOption && (
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>

                            <View style={{ marginRight: 10, marginBottom: height * 0.01 }}>
                                <QuantityButton
                                    quantity={quantityObj ? quantityObj.quantity : 0}
                                    styleBtn={{ backgroundColor: Color.DARK_RED, width: width * 0.08 }}
                                    styleTextInput={{ alignItems: "center" }}
                                    quantityOnChange={(quantity) => quantityOnChange(data, quantity, data ? data.orderProductId : null)}
                                />
                            </View>
                        </View>
                    )}



                </View>

            </>
        )
    }

    return (
        <View style={{ backgroundColor: "#F8F8F8", width: width * 0.95, height: height * 0.15, borderRadius: 10, marginTop: 10 }}>

            <View style={{ flexGrow: 1, flexDirection: "row", justifyContent: "space-between" }}>
                <CardElement />
            </View>



        </View>
    )

};


export default PreviewCart;
