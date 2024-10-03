import React from "react";
import styles from "../../helper/Styles";
import { Text, View } from "react-native";
import Label from "../../components/Label";
import Currency from "../../lib/Currency";

const OrderAmount =(props)=>{
    const {label, amount} = props
return(
    <View style={styles.orderContainer}>
    <View style={styles.orderRow}>
        <Text style={styles.label}>{label} : </Text>
        <View style={{ paddingTop: 10 }} >
            <Label text={Currency.getFormatted(amount ? amount : 0)} bold={true} />
        </View>
    </View>
</View >
)
}
export default OrderAmount;