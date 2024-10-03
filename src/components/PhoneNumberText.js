import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, View } from 'react-native';
const PhoneNumber = (props) => {
    const { phoneNumber,onPress } = props
    return (
        <TouchableOpacity onPress = {onPress} >
        <View >
        <Text>{phoneNumber}</Text>
        </View>
        </TouchableOpacity>
    )
}
export default PhoneNumber