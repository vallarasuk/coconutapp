// Import React and Component
import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AlternativeColor from "../components/AlternativeBackground";
import styles from "../helper/Styles";


const ListUI = ({ List , selectProperty, onPress, showSelectedRow, selectedRowProperty, rowCompareValue}) => {

    return (
        <>
            <View style={styles.container}>
                <View>
                    {(
                        List && List.length > 0 &&
                        List.map((item, index) => {
                            const containerStyle = AlternativeColor.getBackgroundColor(index)
                            return (
                                <TouchableOpacity onPress={(e) => onPress(item)
                                } style={styles.containers}>
                                    <View style={containerStyle}>
                                        <View style={styles.containerView}>
                                            <Text style={styles.ListText}>{item[selectProperty]}</Text>
                                            <View style={styles.view}>
                                               {showSelectedRow && selectedRowProperty && rowCompareValue && item[selectedRowProperty] == rowCompareValue ? <MaterialIcons name="check" size={30} color="green" />:
                                                <MaterialIcons name="chevron-right" size={30} color="gray" />}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )}
                </View>
            </View>
        </>
    )
}

export default ListUI;