// Import React and Component
import React from "react";
import { StyleSheet } from "react-native";

import TextInput from "../components/Text";

const SignUpForm = ({ control, showPassword }) => {

    return (
        <>
            <TextInput
                title={"Full Name"}
                control={control}
                placeholder={"Enter Full Name"}
                name={"name"}
                keyboardType={"text"}
                required={true}
            />

            <TextInput
                title={"Mobile Number"}
                control={control}
                placeholder={"Enter Mobile Number"}
                name={"mobileNumber"}
                keyboardType={"numeric"}
                required={true}
            />


            {showPassword && (
                <>
                    <TextInput
                        title={"Password"}
                        control={control}
                        placeholder="Password"
                        name={"password"}
                        secureTextEntry={true}
                        required={true}
                    />
                </>
            )}

        </>

    );
};
export default SignUpForm;