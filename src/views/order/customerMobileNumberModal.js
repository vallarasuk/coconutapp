import Modal from "../../components/Modal";
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Color } from "../../helper/Color";
import { verticalScale } from "../../components/Metrics";
import MobileNumber from "../../components/PhoneNumber"
const CustomerMobileNumberModal = ({ toggle, modalVisible, title, confirmLabel, cancelLabel, ConfirmationAction, control }) => {

    const [PhoneNumber, setPhoneNumber] = useState("")

    const modalBody = (
        <View style={styles.modalBody}>
            <MobileNumber
                control={control}
                name='mobile_number'
                placeholder={"Enter whatsapp number"}
                title={'PhoneNumber'}
                required={true}

            />

        </View>
    )



    return (
        <>
            <Modal
                title={title}
                modalBody={modalBody}
                toggle={toggle}
                modalVisible={modalVisible}
                button1Label={confirmLabel}
                button1Press={ConfirmationAction}
                button2Label={cancelLabel}
                button2Press={() => toggle()}
            />
        </>
    )
}

export default CustomerMobileNumberModal;


const styles = StyleSheet.create({
    modalHeader: {

    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        color: Color.BLACK
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    modalBody: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    modalFooter: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        height: verticalScale(40),
        backgroundColor: "#fff"
    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    actionText: {
        color: "#fff"

    },
    bodyText: {
        paddingLeft: 60,
    }
});