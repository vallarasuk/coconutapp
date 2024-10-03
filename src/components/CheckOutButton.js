import React from "react";
import { Color } from "../helper/Color";
import Button from "./Button"

const CheckOutButton = (props) => {
    return (
        <Button title={"Check Out"}  backgroundColor={Color.RED} onPress={props?.onPress} />
    )
}

export default CheckOutButton