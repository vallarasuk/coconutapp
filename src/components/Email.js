import React from "react";
import TextInput from "./TextInput";

const Email = (props) => {
    const { values, name,title, onInputChange, required,control,editable } = props;
return(

    <TextInput
    title={title}
    name={name}
    showBorder={true}
    values={values}
    onInputChange={onInputChange}
    keyboardType="email-address"
    control={control}
    required={required}
    editable = {editable}
    />
    )


}
export default Email;