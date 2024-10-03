import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Layout from '../../components/Layout';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorageConstants from "../../helper/AsyncStorage";
import AsyncStorage from "../../lib/AsyncStorage";
import { Color } from '../../helper/Color';
import Button from '../../components/Button';
import addressServices from '../../services/AddressService';
import ObjectName from '../../helper/ObjectName';
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from '../../helper/Styles';
import NoRecordFound from '../../components/NoRecordFound';

const AddressList = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState("");

    const navigator = useNavigation();

    const { width } = Dimensions.get('screen');

    useEffect(() => {
        getUserAddress();
    }, [isFocused]);

    const getUserAddress = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        addressServices.searchAddress({ object_name: ObjectName.USER, object_id: userId }, (err, response) => {
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                setAddress(response.data.data)
            } else {
                setAddress([])
            }
            setIsLoading(false);
        })
    }

    const renderItem = (data) => {
        let item = data.item;

        return (
            <View style={{ height: 90, borderColor: Color.LIGHT_GREY2, backgroundColor: Color.WHITE, borderWidth: 1, marginTop: 10, borderRadius: 10 }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
                    <View style={{ flex: 0.8, justifyContent: "space-around" }}>
                        <Text style={{ fontSize: 14 }} numberOfLines={4}>{item?.address2}</Text>
                        <Text style={{ fontSize: 14 }} numberOfLines={4}>{item?.address1}</Text>
                    </View>
                    <View style={{ flex: 0.2, alignItems: "center" }}>
                        <TouchableOpacity onPress={() => navigator.navigate("AddCustomerAddress", { item: item })}>
                            <Text style={{ color: Color.RED, textAlign: "center" }}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const removeAddress = (data) => {
        let item = data?.item;
        if (item) {
            addressServices.delete(item.id, (err, response) => {
                getUserAddress();
            })
        }
    }


    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={{ height: 110 }}>
                <TouchableOpacity
                    style={[styles.actionDeleteButton, { borderRadius: 10 }]}
                    onPress={() => { removeAddress(data) }}
                >
                    <MaterialCommunityIcons
                        name={`trash-can-outline`}
                        size={26}
                        color={Color.WHITE}
                    />
                    <Text style={[styles.btnText, { textAlign: "center", fontSize: 13 }]}>Remove Address</Text>
                </TouchableOpacity>
            </View>
        )
    };


    return (
        <Layout
            title={"Addresses"}
            showBackIcon={true}
            hideFooterPadding
            isLoading={isLoading}
            FooterContent={(
                <Button title={'Add Address'} style={{ width: width }} backgroundColor={Color.DARK_RED} onPress={() => navigator.navigate("AddCustomerAddress")} />
            )}
        >
            {address && address.length > 0 ? (
                <SwipeListView
                    data={address}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-70}
                    previewOpenValue={-50}
                    previewOpenDelay={3000}
                    disableRightSwipe={true}
                    closeOnRowOpen={true}
                    keyExtractor={item => String(item.id)}
                />
            ) : (
                <NoRecordFound iconName={"box-open"} message={"No Address Found"} />
            )}

        </Layout>
    );
};

export default AddressList;
