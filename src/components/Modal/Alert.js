import { Alert } from "react-native";
class AlertMessage {
    async Error(Message, onDismiss, buttonLabel,titleLabel) {
       
        let buttonObject = {
            text: buttonLabel ? buttonLabel : 'OK'
        }

        if (onDismiss) {
            buttonObject.onPress = onDismiss
        }
        
        Alert.alert(
            titleLabel ? titleLabel : "Error",
            Message,
            [
                buttonObject,
            ],
            { cancelable: true },

        );
    }

    async Success(Message) {
        Alert.alert(
            "Success",
            Message,
            [
                {
                    text: 'OK',
                },
            ],
            { cancelable: false }
        );
    }



}
const alert = new AlertMessage()
export default alert;