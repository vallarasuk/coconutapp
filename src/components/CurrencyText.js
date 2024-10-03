import React from "react";
import {Text } from 'react-native';
import Currency from "../lib/Currency";
import { Color } from "../helper/Color";
import styles from "../helper/Styles";
const CurrencyText = (props) => {
    const { amount,mrp } = props
    return (
        <Text style={[styles.listItemsText,{color : mrp ? Color.GREY : Color.BLACK}]}> {Currency.IndianFormat(amount)}</Text>
    )
}
export default CurrencyText

