import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ALLOW_ONLINE_SALE } from '../../helper/product';
import Status from '../../helper/Status';
import NoRecordFound from '../../components/NoRecordFound';
import Refresh from "../../components/Refresh";
import ProductCard from './components/ProductCard';
import PublicRouteService from '../../services/PublicRouteService';
import Spinner from "../../components/Spinner";
import Search from "./components/Search";
import ArrayList from '../../lib/ArrayList';
import LoginDrawer from "./components/LoginDrawer";
import { Keyboard } from 'react-native';
import AsyncStorageConstants from "../../helper/AsyncStorage";
import AsyncStorage from "../../lib/AsyncStorage";
import OnePortalDB from "../../lib/SQLLiteDB";
import orderSQLQuery from "../../db/order";
import orderProductSQLQuery from "../../db/orderProduct";
import OrderService from '../../services/OrderService';
import Order from '../../helper/Order';
import orderService from '../../services/OrderService';
import asyncStorageService from '../../services/AsyncStorageService';

const Dashboard = (props) => {
    const isFocused = useIsFocused();
    const [productList, setProductList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [cartProductList, setCartProductList] = useState([]);
    const [accountDetail, setAccountDetail] = useState("");
    const [showAccountDrawer, setShowAccountDrawer] = useState(false);
    const [accountExist, setAccountExist] = useState(false);
    const [accountId, setAccountId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [totalCount, setTotalCount] = useState("");

    const navigator = useNavigation();

    const param = props?.route?.params;

    useEffect(() => {
        getDraftOrder();
    }, [isFocused]);

    useEffect(() => {
        getProductsList();
    }, [isFocused, refreshing]);

    useEffect(() => {
        getOrderProducts()
    }, [orderId])

    useEffect(() => {
        if (productList && totalCount != productList.length) {
            getProductsList(null, true, page + 1);
            setPage(page + 1)
        }
    }, [isEndReached]);

    const getOrderProducts = () => {
        if (orderId) {
            let params = { orderId: orderId, pagination: false };
            let orderProductList = [];
            OrderService.getOrderProducts(params, async (error, orderProducts) => {
                if (orderProducts && orderProducts.length > 0) {
                    for (let i = 0; i < orderProducts.length; i++) {
                        orderProductList.push({ productId: orderProducts[i].id, quantity: orderProducts[i].quantity, orderProductId: orderProducts[i].orderProductId })
                    }
                    setCartProductList(orderProductList);
                }
            });
        }
    }

    const getDraftOrder = async () => {
        try {
            OrderService.getDraftCount({ isCustomerRequest: true }, async (res) => {
                if (res && res.data && res.data.draftCountList && res.data.draftCountList.length > 0) {
                    setOrderId(res.data.draftCountList[0].id)
                }
            });

        } catch (err) {
            console.log(err);
        }
    }

    const getProductsList = async (search, isLoadMore, updatedPage) => {
        try {
            let accountId = await AsyncStorage.getItem(AsyncStorageConstants.CUSTOMER_ACCOUNT_ID);

            setAccountId(accountId);

            let params = {};

            if (search) {
                params.search = search;
            }

            params.allow_online_sale = ALLOW_ONLINE_SALE;

            params.status = Status.ACTIVE;

            params.page = updatedPage ? updatedPage : page;

            if (param.categoryId) {
                params.categoryId = param.categoryId;
            }

            if (isLoadMore) {
                setIsFetching(true);
            }

            PublicRouteService.getProducts(params, (error, response) => {
                if (response && response.data && response.data.data) {
                    if (isLoadMore) {
                        setProductList((prevTitles) => {
                            return [...new Set([...prevTitles, ...response.data.data])];
                        });
                        setPage((prevPageNumber) => prevPageNumber + 1);
                        setIsFetching(false);
                        setIsLoading(false)
                    } else {
                        setProductList(response.data.data);
                        setIsLoading(false)
                    }

                    setTotalCount(response.data.totalCount)
                }
                setIsLoading(false)
                setIsEndReached(false);
            });
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

    const addOrderProduct = async (
        quantity,
        productId,
        orderId,
        productPriceId,
        callback
    ) => {
        try {
            const BodyData = {
                orderId: orderId,
                productId: productId,
                quantity: quantity,
                productPriceId: productPriceId,
            };
            await OrderService.addOrderProduct(BodyData, async (error, res) => {
                return callback(res);
            });
        } catch (err) {
            console.log(err);
        }
    };


    const addToCart = async (product) => {

        let userId = await asyncStorageService.getUserId();

        if (accountId && userId) {

            if (!orderId) {

                let bodyObject = {};

                bodyObject.createdBy = userId;

                bodyObject.type = Order.ONLINE

                bodyObject.customer_account = accountId;

                orderService.createCustomerOrder(bodyObject, async (error, response) => {

                    if (response && response.data) {

                        let cardProducts = [...cartProductList];

                        if (cardProducts && cardProducts.length > 0) {

                            let cartIndex = cardProducts.findIndex((data) => data.productId == product.id);

                            if (cartIndex == -1) {
                                cardProducts.push({ productId: product.id, quantity: 1 })
                            }
                        } else {
                            cardProducts.push({ productId: product.id, quantity: 1 })
                        }
                        setCartProductList(cardProducts);

                        setOrderId(response.data.orderId)

                        addOrderProduct(1, product.id, response.data.orderId, product.productPriceId, (response) => {
                            const updatedCardProducts = cardProducts.map(item => {
                                if (item.productId === product.id) {
                                    return { ...item, orderProductId: response.data.orderProductId };
                                }
                                return item;
                            });
                            setCartProductList(updatedCardProducts);
                        })
                    }
                })
            } else {

                let cardProducts = [...cartProductList];

                if (cardProducts && cardProducts.length > 0) {

                    let cartIndex = cardProducts.findIndex((data) => data.productId == product.id);

                    if (cartIndex == -1) {
                        cardProducts.push({ productId: product.id, quantity: 1 })
                    }
                } else {
                    cardProducts.push({ productId: product.id, quantity: 1 })
                }

                setCartProductList(cardProducts);

                addOrderProduct(1, product.id, orderId, product.productPriceId, (response) => {

                    const updatedCardProducts = cardProducts.map(item => {
                        if (item.productId === product.id) {
                            return { ...item, orderProductId: response.data.orderProductId };
                        }
                        return item;
                    });
                    setCartProductList(updatedCardProducts);

                })
            }
        } else {
            setShowAccountDrawer(true)
        }
    }


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
                orderId: orderId,
                quantity: quantity,
                orderProductId: orderProductId,
                product_id: product.id,
            }, (err, response) => { })
    }


    const handleSearchOnChange = (searchTerm) => {
        getProductsList(searchTerm)
    }

    const handleCartClick = () => {
        navigator.navigate("HomeProductCart", { orderId: orderId })
    }

    const handleSubmit = (value) => {
        setAccountExist(false)
        Keyboard.dismiss();
        PublicRouteService.createAccount({ mobileNumber: value }, async (err, response) => {
            if (response && response.data && response.data.accountExist) {
                setAccountExist(response.data.accountExist)
            } else {
                setShowAccountDrawer(false)
            }
            if (response && response.data && response.data.acountDetail) {
                setAccountDetail(response.data.acountDetail);
                await AsyncStorage.setItem(AsyncStorageConstants.CUSTOMER_ACCOUNT_ID, response.data.acountDetail.id.toString());
                setAccountId(response.data.acountDetail.id);
            }

            if (response && response.data && response.data.userDetail) {

                await asyncStorageService.setSessionToken(response.data.userDetail.session_id);

                await asyncStorageService.setRoleId(`${response.data.userDetail.role}`);

                await asyncStorageService.setUserId(`${response.data.userDetail.id}`);
            }

        })
    }

    return (
        <Layout
            title={param.name}
            showBackIcon={true}
            showProfile={true}
            onProfileHandle={onProfileHandle}
            isLoading={isLoading}
        >

            <LoginDrawer isOpen={showAccountDrawer} closeDrawer={() => setShowAccountDrawer(false)} handleSubmit={handleSubmit} accountExist={accountExist} />

            <Refresh refreshing={refreshing} setRefreshing={setRefreshing} onScroll={handleScroll}>

                <Search cartProductLength={ArrayList.isNotEmpty(cartProductList) ? cartProductList.length : 0} handleSearchOnChange={handleSearchOnChange} handleCartClick={handleCartClick} />

                {productList && productList.length > 0 ? (
                    <ProductCard productList={productList} addToCart={addToCart} quantityOnChange={quantityOnChange} cartProductList={cartProductList} />
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

export default Dashboard;
