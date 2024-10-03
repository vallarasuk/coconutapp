import React from 'react';
import { Color } from '../helper/Color';
import Button from './Button';


const DoneButton = (props) => {
    return (
        <Button title={"Done"} color={Color.DONE_BUTTON} onPress={props.onPress} />
    )
}

export default DoneButton