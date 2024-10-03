// Import React and Component
import React, { useState } from "react";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TouchableOpacity
} from "react-native";

import TextInput from "../components/Text";

import { useNavigation } from "@react-navigation/native";

import { Color } from "../helper/Color";

import Button from "../components/Button";
import Label from "../components/Label";
import userService from "../services/UserService";
import AsyncStorage from "../lib/AsyncStorage";

import AsyncStorageConstants from "../helper/AsyncStorage";
import asyncStorageService from "../services/AsyncStorageService";
import Alert from "../components/Modal/Alert";
import { useForm } from "react-hook-form";
import SignUpForm from "../components/SignupForm";
import ArrayList from "../lib/ArrayList";
import { Ionicons } from "@expo/vector-icons";
import Layout from "../components/Layout/LoginLayout";

const Login = ({ }) => {


    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {}
    });

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
       
        userService.SingUp(value, async (err, response) => {
            if (response && response.data && response.data.userDetail) {

                let permissionList;

                let firstName = response.data.userDetail.name
                    ? response.data.userDetail.name
                    : "";

                let lastName = response.data.userDetail.last_name
                    ? response.data.userDetail.last_name
                    : "";

                let name = `${firstName} ${lastName}`;

                await asyncStorageService.setSessionToken(response.data.userDetail.session_id);

                await asyncStorageService.setUserName(name);

                await asyncStorageService.setRoleId(`${response.data.userDetail.role}`);

                await asyncStorageService.setUserId(`${response.data.userDetail.id}`);

                if (response.data.accountDetail) {
                    await AsyncStorage.setItem(AsyncStorageConstants.CUSTOMER_ACCOUNT_ID, `${response.data.accountDetail.id}`);
                }

                //validate permission list
                if (response.data.permissionList && ArrayList.isNotEmpty(response.data.permissionList)) {
                    //convert JSON into string
                    permissionList = JSON.stringify(response.data.permissionList);

                    //set in local storag
                    await asyncStorageService.setPermissions(permissionList);
                }

                navigation.navigate("Home")
            }
        })
    }

    return (
        <Layout showBackIcon={true} backNavigationUrl = {"Login"}>
        <KeyboardAvoidingView behavior="padding" style={[
            styles.container,
            {
                flexDirection: "column",

            },
        ]}>
            <View style={styles.headerContainer}>

                <Label
                    text="Signup"
                    fontWeight={`400`}
                    size={20}
                    color={Color.BLACK}
                    textAlign="center"
                />
            </View>

            <View style={styles.formContainer}>

                <ScrollView>

                    <SignUpForm control={control} showPassword={true} />
                </ScrollView>

            </View>

            <View style={styles.footerContainer}>
                <Button title="Signup" onPress={handleSubmit(values => { signUpHandle(values) })} style={styles.button} />
                <View style={styles.loginContainer}>
                    <Text style={styles.account}>Already Have an Account? </Text>
                    <TouchableOpacity onPress={()=> navigation.navigate("Login")}><Text style={[styles.account, { fontWeight: "bold"}]}>Login</Text></TouchableOpacity>
                </View>
            </View>




        </KeyboardAvoidingView>
        </Layout>
    );
};
export default Login;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    headerContainer: {
      flex: 0.1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    formContainer: {
      flex: 0.75
    },
    footerContainer: {
      flex: 0.15
    },
    button: {
      borderRadius: 10
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center"
    },
    account: {
      color: "black",
      fontSize: 14,
      alignSelf: "flex-end",
      marginTop: 10
    },
    loginText: {
      color: "black",
      fontSize: 14,
      fontWeight: "bold"
    }
  });