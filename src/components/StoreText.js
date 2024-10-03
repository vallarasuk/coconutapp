import React from "react";
import { StyleSheet, Text } from 'react-native';
import styles from "../helper/Styles";
const StoreText = (props) => {
    const { locationName ,style} = props
    return (
        <Text style={style ? style : styles.listItemsText}>{locationName}</Text>
    )
}
export default StoreText
