import React from "react";
import { Text,View } from 'react-native';
import CurrencyText from "./CurrencyText";
import styles from "../helper/Styles";
import Label from "../components/Label";

const CustomerCard = (props) => {
    const { text, amount,customerName } = props

    return (

        <View style ={styles.direction}>
            <Label text = {customerName} size = {14} bold = {true} />
            <Text>, {text}</Text>
             <CurrencyText amount={amount} />
            </View>
    )
}
export default CustomerCard