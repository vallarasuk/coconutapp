import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color } from "../helper/Color";

const Label = (props) => {
    const { text, bold, size, fontWeight,color, textAlign,marginLeft, marginBottom } = props
    return (
        <Text style={{ fontWeight: bold ? 'bold' : fontWeight ? fontWeight : '400', fontSize:size ? size : 12,color : color ? color : Color.BLACK, textAlign: textAlign, marginLeft: marginLeft,marginBottom: marginBottom }}>{text}</Text>

    )
}

export default Label