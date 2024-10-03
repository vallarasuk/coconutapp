import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Layout from '../../components/Layout';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import NoRecordFound from '../../components/NoRecordFound';
import Refresh from "../../components/Refresh";
import Spinner from "../../components/Spinner";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import AsyncStorage from "../../lib/AsyncStorage";
import OrderService from '../../services/OrderService';
import PreviewCart from "./components/PreviewCart";
import { Color } from '../../helper/Color';
import Number from '../../lib/Number';
import Button from '../../components/Button';
import { SwipeListView } from "react-native-swipe-list-view";
import styles from '../../helper/Styles';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import StatusService from '../../services/StatusServices';
import ObjectName from '../../helper/ObjectName';
import Status from '../../helper/Status';
import Toast from 'react-native-simple-toast';
import { StyleSheet } from 'react-native';

const Dashboard = (props) => {
    const isFocused = useIsFocused();
    const [productList, setProductList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [cartProductList, setCartProductList] = useState([]);
    const [accountId, setAccountId] = useState("");
    const [totalCount, setTotalCount] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [nextStatus, setNextStatus] = useState("");

    const navigator = useNavigation();

    const param = props?.route?.params;

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        getProductsList();
        getNewStatus()
    }, [isFocused, refreshing]);

    useEffect(() => {
        if (productList && totalCount != productList.length) {
            getProductsList(null, true, page + 1);
            setPage(page + 1)
        }
    }, [isEndReached]);

    const getNewStatus = () => {
        StatusService.statusList({ object_name: ObjectName.ORDER_TYPE, group_id: Status.GROUP_NEW }, (response) => {
            if (response && response.length > 0) {
                setNextStatus(response[0].id);
            }
        })
    }

    function getOrderTotalAmount(orderProductList) {
        let totalAmount = 0;
        for (let i = 0; i < orderProductList.length; i++) {
            totalAmount += Number.GetFloat(orderProductList[i].sale_price, 0) * Number.Get(orderProductList[i].quantity, 0);
        }
        return totalAmount;

    }

    const getProductsList = async (search, isLoadMore, updatedPage) => {
        try {

            let accountId = await AsyncStorage.getItem(AsyncStorageConstants.CUSTOMER_ACCOUNT_ID);

            setAccountId(accountId);

            if (param.orderId) {
                let params = { orderId: param.orderId, pagination: false }
                let orderProducts = [];
                if (isLoadMore) {
                    setIsFetching(true);
                }

                OrderService.getOrderProducts(params, (error, orderProduct, totalAmount, totalQuantity) => {

                    if (orderProduct) {

                        if (isLoadMore) {
                            setProductList((prevTitles) => {
                                return [...new Set([...prevTitles, ...orderProduct])];
                            });
                            setPage((prevPageNumber) => prevPageNumber + 1);
                            setIsFetching(false);
                            setIsLoading(false)
                        } else {
                            setProductList(orderProduct);
                            setIsLoading(false)
                        }

                        const totalAmount = getOrderTotalAmount(orderProduct);

                        setTotalAmount(totalAmount);

                        if (orderProduct && orderProduct.length > 0) {
                            for (let i = 0; i < orderProduct.length; i++) {
                                orderProducts.push({ productId: orderProduct[i].id, quantity: orderProduct[i].quantity, orderProductId: orderProduct[i].orderProductId })
                            }
                            setCartProductList(orderProducts);
                        }
                    }
                    setIsEndReached(false);
                    setIsLoading(false)
                });
            } else {
                setIsLoading(false)
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    };

    const onProfileHandle = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        if (userId) {
            navigator.navigate("MyAccount")
        } else {
            navigator.navigate("Login")
        }
    }

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 100;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            setIsEndReached(true);
        } else {
            setIsEndReached(false);
        }
    };

    const quantityOnChange = (product, quantity, orderProductId) => {
        let cardProducts = [...cartProductList];
        if (cardProducts && cardProducts.length > 0) {
            let cartIndex = cardProducts.findIndex((data) => data.productId == product.id);
            if (cartIndex > -1) {
                if (quantity > 0) {
                    cardProducts[cartIndex].quantity = quantity;
                } else {
                    cardProducts.splice(cartIndex, 1);
                }
            }
        }
        setCartProductList([...cardProducts])

        OrderService.updateOrderProduct(
            orderProductId,
            {
                orderId: param?.orderId,
                quantity: quantity,
                orderProductId: orderProductId,
                product_id: product.id,
            }, (err, response) => {
                getProductsList();
            })
    }


    const onProceedOrder = () => {
        if (param.orderId && nextStatus) {
            OrderService.updateOrder(param.orderId, { status: nextStatus }, (err, response) => {
                if (response && response.data) {
                    Toast.show("Order Placed Successfully", Toast.LONG);
                    navigator.navigate("Home");
                }
            })
        }
    }

    const deleteOrderProduct = (data) => {
        if (data && data.item) {
            OrderService.deleteOrderProduct(data.item.orderProductId, param.orderId, () => {
                getProductsList();
            })
        }
    }


    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>

                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => { deleteOrderProduct(data) }}
                >
                    <MaterialCommunityIcons
                        name={`trash-can-outline`}
                        size={26}
                        color={Color.WHITE}
                    />
                    <Text style={[styles.btnText, { textAlign: "center", fontSize: 13 }]}>Remove Item</Text>
                </TouchableOpacity>
            </View>
        )
    };

    const renderItem = (data) => {
        let item = data.item;
        return (
            <PreviewCart data={item} quantityOnChange={quantityOnChange} cartProductList={cartProductList} showQuantityOption={true}/>
        )
    }

    return (
        <Layout
            title={"Review Cart"}
            showBackIcon={true}
            showProfile={true}
            onProfileHandle={onProfileHandle}
            isLoading={isLoading}
            hideFooterPadding
            FooterContent={(
                <View style={style.container}>
                    <View style={style.innerContainer}>
                        <Text style={style.totalText}>{`Total: \u20B9${totalAmount.toFixed(0)}`}</Text>
                        <Button title={'Proceed'} style={style.button} backgroundColor={Color.DARK_RED} onPress={onProceedOrder} />
                    </View>
                </View>
            )}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing} onScroll={handleScroll}>

                {productList && productList.length > 0 ? (
                    <SwipeListView
                        data={productList}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-70}
                        previewOpenValue={-50}
                        previewOpenDelay={3000}
                        disableRightSwipe={true}
                        closeOnRowOpen={true}
                        keyExtractor={item => String(item.orderProductId)}
                    />

                ) :
                    <NoRecordFound iconName={"box-open"} message={"No Products Found"} />
                }

                {isFetching && (
                    <Spinner />
                )}
            </Refresh>
        </Layout>
    );
};
const style = StyleSheet.create({
    container: {
      height:  Dimensions.get("window").height * 0.08,
      width:  Dimensions.get("window").width * 0.98,
      borderColor: Color.LIGHT_GREY2,
      borderWidth: 1,
    },
    innerContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    totalText: {
        marginLeft: 10, 
        fontWeight: "bold" 
    },
    button: {
      width: Dimensions.get("window").width * 0.3
    }
  });

export default Dashboard;
