// Import React and Component
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Color } from "../../helper/Color";

import Button from "../../components/Button";
import Label from "../../components/Label";
import userService from "../../services/UserService";
import AsyncStorage from "../../lib/AsyncStorage";

import AsyncStorageConstants from "../../helper/AsyncStorage";
import asyncStorageService from "../../services/AsyncStorageService";
import Alert from "../../components/Modal/Alert";
import { useForm } from "react-hook-form";
import SignUpForm from "../../components/SignupForm";
import Layout from '../../components/Layout';
import VerticalSpace10 from "../../components/VerticleSpace10";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import User from "../../helper/User";

const EditAccount = (props) => {

    let params = props?.route?.params

    const [userDetail, setUserDetail] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const [confirmationModal, setShowConfirmation] = useState(false);

    const isFocused = useIsFocused();

    const navigation = useNavigation();

    useEffect(() => {
        getUserDetail();
    }, [isFocused]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: {}
    });

    const getUserDetail = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        let userDetail;
        if (userId) {
            userService.get(userId, (err, response) => {
                userDetail = response.data;
                if (response && response.data) {
                    setUserDetail(response.data);
                    setValue("firstName", userDetail?.first_name);
                    setValue("lastName", userDetail?.last_name);
                    setValue("email", userDetail?.email);
                    setValue("mobileNumber", userDetail?.mobileNumber1);
                    setValue("address", userDetail?.address1);

                }
                setIsLoading(false);
            })
        } else {
            setIsLoading(false);
        }
    }

    const getInputType = (value) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regular expression for phone number validation
        const phoneRegex = /^\d{10}$/; // Modify this regex according to your phone number format

        if (emailRegex.test(value)) {
            return true;
        } else if (phoneRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    };

    const signUpHandle = (value) => {
        if (params && params.userId) {
            let updateObj = {};
            if (value && !value.email) {
                return Alert.Error("Email is required");
            } else {
                const inputType = getInputType(value.email);

                if (!inputType) {
                    return Alert.Error("Invalid Email");
                }
            }

            updateObj.first_name = value.firstName;

            updateObj.last_name = value.lastName;

            updateObj.email = value.email;

            updateObj.mobileNumber1 = value.mobileNumber;

            userService.update(params.userId, updateObj, async (err, response) => {
                if (response && response.data) {
                    navigation.navigate("MyAccount")
                }
            })
        }
    }

    const showModal = () => {
        setShowConfirmation(!confirmationModal)
    }

    const deleteAccount = async () => {
        const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
        if (userId) {
            userService.Delete(userId, async (res) => {
                if (res) {
                    await AsyncStorage.clearAll();
                    navigation.navigate("Home");
                }
            })
        }
    }

    return (
        <Layout
            title={"Update Account"}
            showBackIcon={true}
            hideContentPadding
            isLoading={isLoading}
            FooterContent={
                <>
                    <Button title="Save" onPress={handleSubmit(values => { signUpHandle(values) })} style={{ borderRadius: 10 }} />
                    <VerticalSpace10 />
                    <Button title="Delete Account" onPress={() => showModal()} style={{ borderRadius: 10, backgroundColor: Color.DARK_RED }} />
                </>
            }
        >

            <DeleteConfirmationModal
                modalVisible={confirmationModal}
                updateAction={deleteAccount}
                titleMessage={"Delete Confirmation"}
                confirmationMessage={"Are you sure want to delete your account ?"}
                toggle={showModal}
            />

            <View style={[styles.container, { flexDirection: "column" }]}>

                <View style={{ flex: 0.9 }}>

                    <ScrollView>

                        <SignUpForm control={control} />

                    </ScrollView>

                </View>

            </View>
        </Layout>

    );
};
export default EditAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
