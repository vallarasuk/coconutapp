import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Layout from '../../components/Layout';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorageConstants from "../../helper/AsyncStorage";
import AsyncStorage from "../../lib/AsyncStorage";
import { Color } from '../../helper/Color';
import Order from '../../helper/Order';
import VerticalSpace10 from '../../components/VerticleSpace10';
import customerService from '../../services/CustomerService';

const MyOrder = (props) => {
    const isFocused = useIsFocused();
    const [orders, setOrders] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { width } = Dimensions.get('window');

    const navigator = useNavigation();

    useEffect(() => {
        getOrders();
    }, [isFocused]);

    const getOrders = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        if (userId) {
            setIsLoading(true);
            customerService.searchByUser({ type: Order.ONLINE, createdBy: userId }, (err, response) => {
                setOrders(response)
                setIsLoading(false);
            })
        }
    }

    return (
        <Layout
            title={"Orders"}
            showBackIcon={true}
            hideFooterPadding
            isLoading={isLoading}
        >
            {orders && orders.length > 0 && orders.map((data, index) => {
                return (
                    <>
                        <TouchableOpacity onPress={()=> navigator.navigate("CustomerOrderProductList", { orderId: data.orderId})} style={{ height: 110, width: width * 0.95, borderColor: Color.LIGHT_GREY2, borderWidth: 1, borderRadius: 10, marginTop: index == 0 ? 10 : 0 }}>

                            <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 10, marginTop: 10 }}>

                                <View style={{ flex: 0.8, flexDirection: "column", alignItems: "flex-start" }}>

                                    <Text style={{ fontSize: 16, fontWeight: "bold" }} numberOfLines={2}>{`${data.productName}`}</Text>

                                </View>

                                <View style={{ flex: 0.2, flexDirection: "column", alignItems: "flex-end" }}>
                                    <Text style={{ paddingBottom: 5, fontWeight: "bold" }}>{`\u20B9${data.total_amount}`}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 10, marginTop: 10 }}>
                                <Text style={{ paddingBottom: 5, color: Color.LIGHT_GREY1 }}>{`order #${data.order_number}`}</Text>
                                <Text style={{ paddingBottom: 5, color: data.statusColor ? data.statusColor : Color.LIGHT_GREY1 }}>{`${data.status}`}</Text>
                            </View>
                        </TouchableOpacity>

                        <VerticalSpace10 />
                    </>
                )
            })}

        </Layout>
    );
};

export default MyOrder;
