import React from "react";
import TextInput from "./TextInput";

const PinCode = (props) => {
    const { control, onPinCodeChange,title ,name} = props;
    return (
        <TextInput
            title={title}
            name= {name}
            control={control}
            maxLength={6}
            keyboardType="numeric"
            onInputChange={onPinCodeChange}
        />
    )


}
export default PinCode;