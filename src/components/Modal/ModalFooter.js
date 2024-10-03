import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Color } from "../../helper/Color";
import { verticalScale } from "../Metrics";
import Button from "../../components/Button";
import style from "../../helper/Styles";

const ModalFooter = ({ toggle, button1Label,isSubmit, button1Press, button2Label, button2Press }) => {


    return (
        <View style={styles.modalFooter}>
            <View style={style.cardContainer}>


                <Button isSubmit={isSubmit} title={button1Label} width={button2Label ? "50%" : "100%"} backgroundColor={Color.PRIMARY} onPress={() => {
                    toggle && toggle();
                    button1Press && button1Press()
                }} />

                {button2Label && (
                    <Button isSubmit={isSubmit} title={button2Label} width={"50%"} backgroundColor={Color.SECONDARY_BUTTON} onPress={() => {
                        toggle && toggle();
                        button2Press && button2Press();
                    }} />
                )}
            </View>

        </View>
    )
}
export default ModalFooter
const styles = StyleSheet.create({
    modalFooter: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        height: verticalScale(40),
        backgroundColor: "#fff"
    },

})