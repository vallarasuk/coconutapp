import React, { useState, useEffect } from 'react';

import { useForm } from "react-hook-form";

import { Modal, View, Dimensions, Text, Platform, KeyboardAvoidingView } from 'react-native';

import TextInput from "../../../components/TextInput";

import { Color } from '../../../helper/Color';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../../components/Button';
import styles from '../../../helper/Styles';
import { useIsFocused } from '@react-navigation/native';


const LoginDrawer = (
    {
        isOpen,
        handleSubmit,
        closeDrawer,
        accountExist
    }) => {

    const [mobileNumber, setMobileNumber] = useState("")

    const isFocused = useIsFocused();

    const windowHeight = Dimensions.get('window').height;

    useEffect(()=> {
        setValue("mobileNo", "");
    },[isFocused, isOpen]);

    const {
        control,
        formState: { errors },
        setValue
    } = useForm({ defaultValues: {} });

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isOpen}
            >
                <KeyboardAvoidingView style={{ flex: 1, justifyContent: "flex-end" }} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
                    <View style={[styles.modalContent, { height: windowHeight * 0.5, backgroundColor: Color.DRAWER_BACKGROUND }]}>
                        <View style={[styles.closeButton]}>
                            <MaterialIcons name="close" size={30} color={Color.GREY} onPress={() => closeDrawer()} />
                        </View>
                        <View style={{ flex: 1, justifyContent: "flex-start" }}>
                            <TextInput
                                title="Mobile No"
                                name="mobileNo"
                                control={control}
                                required={true}
                                keyboardType={"numeric"}
                                onInputChange={(value) => setMobileNumber(value)}
                            />
                            <Text style={{ marginTop: 10 }}>
                                Please sign up for an account before adding items to your cart
                            </Text>

                            {accountExist && (
                                <Text style={{ marginTop: 10, color: Color.RED, textAlign: "center" }}>
                                    Account Already Exist
                                </Text>
                            )}
                        </View>
                        <View >
                            <View style={styles.applyButton}>
                                <Button title={accountExist ? "Continue" : "Login/Signup"} backgroundColor={Color.DARK_RED} onPress={() => accountExist ?  closeDrawer() :handleSubmit(mobileNumber)} />
                            </View>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </Modal>

        </>
    )
};

export default LoginDrawer;