import React, { useState, useEffect } from "react";

import { TouchableOpacity, View, Text } from "react-native";

import Layout from "../../../components/Layout";

import ProductCard from "../../../components/ProductCard";

import { SwipeListView } from "react-native-swipe-list-view";

import BulkOrderService from "../../../services/BulkOrderService";
import styles from "../../../helper/Styles";
import CurrencyFormat from "../../../lib/Currency";
import { Color } from "../../../helper/Color";
import Button from "../../../components/Button";
import ProductEditModal from "../../../components/Modal/ProductEditModal";
import DeleteModal from "../../../components/Modal/DeleteModal";
import AlertMessage from "../../../helper/AlertMessage";
import Order from "../../../helper/Order";
import { useNavigation } from "@react-navigation/native";
import ArrayList from "../../../lib/ArrayList";
import NoRecordFound from "../../../components/NoRecordFound";

const BulkOrderCart = (props) => {

    const params = props?.route?.params;

    const [productList, setProductList] = useState("");

    const [totalAmount, setTotalAmount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [orderDetail, setOrderDetail] = useState("");

    const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);

    const [productModalOpen, setProductModalOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        getOrderDetail();
        getProductList();
    }, []);

    const getOrderDetail = async () => {
        let orderDetails = await BulkOrderService.getOrder(params.orderId);
        if (orderDetails) {
            setTotalAmount(orderDetails.total_amount > 0 ? orderDetails.total_amount : 0);
            setOrderDetail(orderDetails);
        }
    }

    const getProductList = async () => {

        if (params && params.orderId) {

            setIsLoading(true);

            let productLists = new Array();

            let productList = await BulkOrderService.getProductList(params.orderId);

            if (productList && productList.length > 0) {

                for (let i = 0; i < productList.length; i++) {
                    productLists.push({
                        name: productList[i].product_display_name,
                        quantity: productList[i].quantity,
                        orderProductId: productList[i].orderProductId,
                        localOrderId: productList[i].local_order_id,
                        productId: productList[i].product_id,
                        featured_media_url: productList[i].featured_media_url,
                        sale_price: productList[i].sale_price,
                        product_name: productList[i].product_display_name,
                        mrp: productList[i].mrp,
                        cost: productList[i].cost,
                        cgstPercentage: productList[i].cost,
                    })
                }

                setProductList(productLists)
            } else {
                setProductList([]) 
            }
            setIsLoading(false);
        }
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const productDeleteModalToggle = () => {
        setProductDeleteModalOpen(!productDeleteModalOpen);
    };

    const productModalToggle = () => {
        setProductModalOpen(!productModalOpen);
    };

    const cancelOrderProduct = async () => {
        if (selectedItem) {
            await BulkOrderService.removeProduct(selectedItem.localOrderId, selectedItem.orderProductId);
            productDeleteModalToggle();
            await BulkOrderService.updateTotalAmount(selectedItem.localOrderId);
            getProductList();
            getOrderDetail();
        }
    }

    const updateQuantity = async (quantity) => {
        if (selectedItem) {
            await BulkOrderService.updateOrderProduct(selectedItem.orderProductId, quantity);
            productModalToggle();
            await BulkOrderService.updateTotalAmount(selectedItem.localOrderId);
            getProductList();
            getOrderDetail();
        }
    }

    const onCompete = () => {
        BulkOrderService.completeOrder({
            totalAmount: orderDetail.total_amount,
            type: Order.TYPE_BULK_ORDER,
            storeId: orderDetail.store_id,
            customerAccount: orderDetail.customer_account,
            customerMobileNumber: orderDetail.customer_phone_number
        }, productList, (err, response) => {
            navigation.navigate("Order")
        });
    }

    const renderHiddenItem = (data, rowMap) => {
        let item = data?.item;

        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={
                        styles.productDelete
                    }
                    onPress={() => {
                        setSelectedItem(item);
                        productDeleteModalToggle();
                        closeRow(rowMap, item.orderProductId);
                    }}
                >
                    <Text style={styles.btnText}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.productEdit}
                    onPress={() => {
                        setSelectedItem(item);
                        productModalToggle();
                        closeRow(rowMap, item.orderProductId);
                    }}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>

            </View>
        );
    }

    const ListItem = React.memo(function ListItem({ item }) {

        return (
            <View style={{ flex: 1, flexDirection: "row" }}>
                {item && (
                    <>
                        <ProductCard
                            size={item.size}
                            unit={item.unit}
                            name={item.product_name}
                            image={item.featured_media_url}
                            brand={item.brand_name}
                            sale_price={item.sale_price}
                            mrp={item.mrp}
                            id={item.id}
                            item={item}
                            quantity={item.quantity}
                            editable
                            noIcon
                            QuantityField
                        />
                    </>
                )}

            </View>);
    });

    return (
        <Layout
            title={`Confirm Order (${productList.length})`}
            isLoading={isLoading}
            showBackIcon={true}
        >

            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.8 }}>

                    {ArrayList.isNotEmpty(productList) ? (
                        <SwipeListView
                            data={productList}
                            renderItem={(data) => (<ListItem item={data?.item} />)}
                            renderHiddenItem={renderHiddenItem}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            rightOpenValue={-150}
                            closeOnRowOpen={false}
                            keyExtractor={(item) => String(item.orderProductId)}
                            disableRightSwipe={true}
                        />
                    ) : (
                        <NoRecordFound iconName={"receipt"} message={"No Records Found"} />
                    )}
                </View>


                {productDeleteModalOpen && (
                    <DeleteModal
                        modalVisible={productDeleteModalOpen}
                        toggle={productDeleteModalToggle}
                        item={selectedItem}
                        updateAction={cancelOrderProduct}
                        heading={AlertMessage.CANCEL_MODAL_TITLE}
                        description={AlertMessage.CANCEL_MODAL_DESCRIPTION}
                    />
                )}

                {productModalOpen && (
                    <ProductEditModal
                        modalVisible={productModalOpen}
                        toggle={productModalToggle}
                        item={selectedItem}
                        updateAction={updateQuantity}
                        quantityOnChange={updateQuantity}
                    />
                )}

                <View style={{ flex: 0.2 }}>
                    <View style={styles.totalAmount}>
                        <View style={styles.align}>
                            <Text style={styles.letter}>
                                Total Amount:&nbsp;&nbsp;
                                <Text style={styles.letterColor}>
                                    {CurrencyFormat.IndianFormat(parseFloat(totalAmount))}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: "100%", flex: 1 }}>
                        <Button title={"COMPLETE"} backgroundColor={Color.BLACK} onPress={() => onCompete()} />
                    </View>
                </View>

            </View>
        </Layout>
    )

}

export default BulkOrderCart;