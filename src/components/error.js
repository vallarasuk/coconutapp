import React from "react";
import { Text } from "react-native";
const ErrorMessage = ({ placeholder, title, error, validate }) => {
    return (
        <>
            {error && (
                <Text style={{ color: 'red', alignSelf: 'stretch' }}>{error.message}</Text>
            )}
            {validate && (
                <Text style={{ color: 'red', alignSelf: 'stretch' }}>{`Enter ${title}`}</Text>
            )}
        </>
    )
}
export default ErrorMessage