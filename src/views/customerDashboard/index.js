import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Layout from '../../components/Layout';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorageConstants from "../../helper/AsyncStorage";
import AsyncStorage from "../../lib/AsyncStorage";
import { Color } from '../../helper/Color';
import userService from '../../services/UserService';
import UserAvatar from "react-native-user-avatar";
import Order from '../../helper/Order';
import Button from '../../components/Button';
import customerService from '../../services/CustomerService';
import addressServices from '../../services/AddressService';
import ObjectName from '../../helper/ObjectName';

const MyAccount = (props) => {
    const isFocused = useIsFocused();
    const [userDetail, setUserDetail] = useState("");
    const [orders, setOrders] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState("");

    const navigator = useNavigation();

    const { width, height } = Dimensions.get('screen');

    const profileCartHeight = height * 0.15

    useEffect(() => {
        getUserDetail();
        getOrders()
        getUserAddress();
    }, [isFocused]);

    const getUserDetail = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        if (userId) {
            userService.get(userId, (err, response) => {
                if (response && response.data) {
                    setUserDetail(response.data)
                }
                setIsLoading(false);
            })
        } else {
            setIsLoading(false);
        }
    }

    const getUserAddress = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        addressServices.searchAddress({ object_name: ObjectName.USER, object_id: userId }, (err, response) => {
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                setAddress(response.data.data[0])
            }
        })
    }

    const getOrders = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        if (userId) {
            customerService.searchByUser({ type: Order.ONLINE, createdBy: userId }, (err, response) => {
                if (response && response.length > 0) {
                    setOrders(response[0])
                }
            })
        }
    }

    const logOut = () => {
        AsyncStorage.clearAll();
        navigator.navigate("Home")
    }

    return (
        <Layout
            title={"My Account"}
            showBackIcon={true}
            hideFooterPadding
            hideContentPadding
            isLoading={isLoading}
            FooterContent={(
                <Button title={'Logout'} style={{ width: width }} backgroundColor={Color.DARK_RED} onPress={() => logOut()} />
            )}
        >
            <View style={{ height: profileCartHeight, width: width, backgroundColor: Color.LIGHT_GREY2 }}>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flex: 0.25, justifyContent: "space-around", alignItems: "center" }}>
                        <UserAvatar
                            size={height * 0.09}
                            name={`${userDetail.first_name} ${userDetail.last_name}`}
                            bgColor={Color.PRIMARY}
                            style={{ borderRadius: 50 }}
                        />
                    </View>

                    <View style={{ flex: 0.65, flexDirection: "column", alignItems: "flex-start" }}>
                        {(userDetail.first_name || userDetail.last_name) && (
                            <Text style={{ fontSize: 16, fontWeight: "bold", paddingBottom: 5 }}>{`${userDetail.first_name ? userDetail.first_name : ""} ${userDetail.last_name ? userDetail.last_name : ""}`}</Text>
                        )}
                        {userDetail.email && (
                            <Text style={{ paddingBottom: 5 }}>{userDetail.email ? userDetail.email : ""}</Text>
                        )}
                        {userDetail.mobileNumber1 && (
                            <Text style={{ paddingBottom: 5 }} >{userDetail.mobileNumber1 ? userDetail.mobileNumber1 : ""}</Text>
                        )}
                    </View>

                    <View style={{ flex: 0.1, flexDirection: "column", alignItems: "flex-start" }}>
                        <TouchableOpacity onPress={() => navigator.navigate("EditAccount", { userId: userDetail.id })}>
                            <Text style={{ color: Color.RED }} >Edit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            {orders && (
                <View style={{ height: 115, width: width * 0.95, borderColor: Color.LIGHT_GREY2, borderWidth: 1, marginTop: 10, marginHorizontal: 10, borderRadius: 10 }}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <View style={{ flex: 0.2, paddingVertical: 5, borderBottomColor: Color.LIGHT_GREY2, borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", paddingHorizontal: 10 }} numberOfLines={1}>Orders</Text>
                        </View>

                        <View style={{ flex: 0.8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
                            <View style={{ flex: 0.8, justifyContent: "space-around" }}>
                                <Text style={{ fontSize: 14 }} numberOfLines={2}>{`${orders.productName}`}</Text>
                                <View style={{flexDirection: "row", alignItems: "center", marginTop: 2}}>
                                    <Text style={{ color: Color.LIGHT_GREY1, }}>{`order #${orders.order_number}`}</Text>
                                    <Text style={{ fontWeight: "bold", color: Color.LIGHT_GREY1, marginLeft: 20 }}>{`\u20B9${orders.total_amount}`}</Text>
                                </View>
                                <Text style={{ color: orders.statusColor ? orders.statusColor : Color.LIGHT_GREY1, marginTop: 2 }}>{`${orders.status}`}</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center" }}>
                                <TouchableOpacity onPress={() => navigator.navigate("MyOrder")}>
                                    <Text style={{ color: Color.RED, textAlign: "center" }}>View All</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            )}

            <View style={{ height: 100, width: width * 0.95, borderColor: Color.LIGHT_GREY2, borderWidth: 1, marginTop: 10, marginHorizontal: 10, borderRadius: 10 }}>
                <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ flex: 0.25, paddingVertical: 5, borderBottomColor: Color.LIGHT_GREY2, borderBottomWidth: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", paddingHorizontal: 10}} numberOfLines={1}>Addresses</Text>
                    </View>

                    <View style={{ flex: 0.75, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
                        <View style={{ flex: 0.8, justifyContent: "space-around" }}>
                            <Text style={{ fontSize: 14 }} numberOfLines={4}>{address?.address1}</Text>
                        </View>
                        <View style={{ flex: 0.2, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => navigator.navigate(address ? "CustomerAddressList" : "AddCustomerAddress")}>
                                <Text style={{ color: Color.RED, textAlign: "center" }}>{address ? "View All" : "Add"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>


        </Layout>
    );
};

export default MyAccount;
