import React from "react";
import { Image, View, Text, Dimensions } from "react-native";
import ArrayList from "../../../lib/ArrayList";
import { Color } from "../../../helper/Color";
import NoProduct from '../../../assets/NoProduct.png';
import Button from '../../../components/Button';
import QuantityButton from '../../../components/QuantityButton';

const ProductCard = ({ productList, addToCart, quantityOnChange, cartProductList }) => {

    const { width, height } = Dimensions.get('window');

    const CardElement = ({ product }) => {

        let quantityObj = cartProductList && ArrayList.isNotEmpty(cartProductList) && cartProductList.find((data) => data.productId == product.id);

        return (
            <View style={{ backgroundColor: "#F8F8F8", width: width * 0.466, height: height * 0.28, alignItems: "center", justifyContent: "space-evenly", borderRadius: 10 }}>


                {!product.featured_media_url ? (
                    <Image source={NoProduct} style={{
                        width: width * 0.19,
                        height: height * 0.1,
                    }} />
                ) : (
                    <Image source={{ uri: product.featured_media_url }} style={{
                        width: width * 0.19,
                        height: height * 0.1,
                    }} />
                )}

                <Text numberOfLines={2} style={{ fontSize: 12, paddingHorizontal: 5, fontWeight: "500" }}>{product.product_display_name}</Text>

                {(product.sale_price && product.mrp) && (
                    <View>
                        {product.sale_price == product.mrp ? (
                            <Text style={{ fontSize: 14, padding: height * 0.01 }}>{`\u20B9${product.mrp}`}</Text>
                        ) : (
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ textDecorationLine: 'line-through',  color: Color.LIGHT_GREY1  }}>{`\u20B9${product.mrp}`}</Text>
                                <Text style={{ marginLeft: 5, fontWeight: "bold" }}>{`\u20B9${product.sale_price}`}</Text>
                            </View>
                        )}
                    </View>
                )}

                {quantityObj ? (
                    <QuantityButton
                        quantity={quantityObj ? quantityObj.quantity : 0}
                        styleBtn={{ backgroundColor: Color.DARK_RED, width: width * 0.08 }}
                        styleTextInput={{ alignItems: "center"}}
                        quantityOnChange={(quantity) => quantityOnChange(product, quantity, quantityObj ? quantityObj.orderProductId: null)}
                    />
                ) : (
                    <Button title={'Add'} backgroundColor={Color.DARK_RED} width={width * 0.25} onPress={() => addToCart(product)} />
                )}

            </View>
        )
    }

    return (
        <View style={{ marginTop: 10 }}>
            {productList && ArrayList.chunkArray(productList, 2).map((product) => {
                return (
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: width * 0.95, paddingBottom: 10 }}>
                        {product.map((data) => {
                            return (
                                <>
                                    {data.featured_media_url ? (
                                        <CardElement product={data} />
                                    ) : (
                                        <CardElement product={data} noImage />
                                    )}
                                </>
                            )
                        })}

                    </View>
                )
            })}

        </View>
    )

};


export default ProductCard;
