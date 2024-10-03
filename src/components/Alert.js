

import { Alert } from "react-native";

const AlertModal = ( message,title) =>

    Alert.alert(
        title ? title : "Error",
        message,
        [
            {
                text: 'OK',
            },
        ],
        { cancelable: false }
    );
export default AlertModal;
