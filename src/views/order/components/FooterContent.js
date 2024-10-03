import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Color } from "../../../helper/Color";
import Button from "../../../components/Button";
import styles from "../../../helper/Styles"

const FooterContent = ({ orderProducts, addNew, totalAmount, onPress,delivery }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.swipeStyle }>
            <View style={styles.buttons}>
                <View style={styles.completeButton}>
                    <View style={{ width: "100%", }}>
                        <Button title={"COMPLETE"} backgroundColor={Color.BLACK} onPress={() => { onPress() }}
                        />
                    </View>
                </View>

                <View style={[styles.completeButton, { marginLeft: 2 }]} >         
                           <View style={{ width: "100%", }}>
                        <Button title={"SCAN"} backgroundColor={Color.GREEN} onPress={() => { addNew() }} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default FooterContent;