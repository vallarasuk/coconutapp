import React from "react";
import {StyleSheet, Text} from 'react-native';
import { Color } from "../helper/Color";
import DateTime from "../lib/DateTime";
const DateText=(props)=>{
    const { date,style,dateFormat } = props

    return (

    <Text style={style ? style : styles.date}>
        {dateFormat ? DateTime.formatDate(date) : date}
  </Text>
    )
}
export default DateText
const styles = StyleSheet.create({

date: {
    fontSize: 14,
    color: Color.GREY,
},
})