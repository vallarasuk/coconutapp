import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CurrencyText from "../../../components/CurrencyText";
import DateText from "../../../components/DateText";
import IdText from "../../../components/IdText";
import Label from "../../../components/Label";
import styles from "../../../helper/Styles";
import UserCard from "../../../components/UserCard";
import Status from "../../../components/Status";


const PurchaseOrderCard = (props) => {
    const { item, navigation, alternative } = props;

    return (
        <TouchableOpacity activeOpacity={1.2} style={[styles.leadContainer, alternative]} onPress={() => {
            navigation.navigate("PurchaseOrderDetail", { item })
        }}  >
            <View style={{ flex: 1 }}>
                <Text>
                    <IdText id={item?.purchase_order_number} />
                    <DateText date={item?.date} dateFormat/>
                </Text>

                <Label text={item.vendor_name} bold={true} />

                <CurrencyText amount={item?.amount} />
                <UserCard firstName={item.owner_name} image={item?.image} />

            </View>
            {item?.status && (
                <Status
                    status={item?.status} backgroundColor={item?.statusColor}
                />
            )}



        </TouchableOpacity>
    );
};

export default PurchaseOrderCard;

