import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions } from "react-native";
import Layout from '../../components/Layout';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import NoRecordFound from '../../components/NoRecordFound';
import Refresh from "../../components/Refresh";
import Spinner from "../../components/Spinner";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import AsyncStorage from "../../lib/AsyncStorage";
import OrderService from '../../services/OrderService';
import PreviewCart from "../home/components/PreviewCart";
import { Color } from '../../helper/Color';
import Number from '../../lib/Number';

const OrderProductList = (props) => {
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

    const navigator = useNavigation();

    const param = props?.route?.params;

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        getProductsList();
    }, [isFocused, refreshing]);

    useEffect(() => {
        if (productList && totalCount != productList.length) {
            getProductsList(null, true, page + 1);
            setPage(page + 1)
        }
    }, [isEndReached]);


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


    return (
        <Layout
            title={"Products"}
            showBackIcon={true}
            showProfile={true}
            onProfileHandle={onProfileHandle}
            isLoading={isLoading}
            hideFooterPadding
            FooterContent={(
                <View style={{ height: height * 0.07, width: width * 0.98, borderColor: Color.LIGHT_GREY2, borderWidth: 1 }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ marginLeft: 10, fontWeight: "bold" }}>{`Total: \u20B9${totalAmount.toFixed(0)}`}</Text>
                    </View>
                </View>
            )}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing} onScroll={handleScroll}>

                {productList && productList.length > 0 ? productList.map((data) => (
                    <PreviewCart data={data} cartProductList={cartProductList} showQuantityOption={false} />
                )) : (
                    <NoRecordFound iconName={"box-open"} message={"No Products Found"} />
                )}

                {isFetching && (
                    <Spinner />
                )}
            </Refresh>
        </Layout>
    );
};

export default OrderProductList;
