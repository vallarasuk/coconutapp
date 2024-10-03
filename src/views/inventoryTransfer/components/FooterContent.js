import React from "react";
import {
    View,
    Text,
    Button
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Color } from "../../../helper/Color";
import { StyleSheet } from "react-native";

const FooterContent = ({ searchNavigationParams, products, onScanClickAction, totalQuantity, searchNavigationUrl }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container }>
            <View style={ products && products.length == 0 ? styles.container : styles.partialFlex}>
                <View style={styles.row}>
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapper}>
                            <Button title={"Scan"} color={Color.COMPLETE} onPress={() => { onScanClickAction() }} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullFlex: {
        flex: 1,
    },
    partialFlex: {
        flex: 0.6,
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 2,
    },
    buttonWrapper: {
        width: "100%",
    },
});

export default FooterContent;