import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import { ErrorMessage } from "../helper/ErrorMessage";


class OTPService{

   static async create(createData, navigation,callback) {

        try {
            let sessionToken = await AsyncStorage.getItem(
              AsyncStorageConstants.SESSION_TOKEN
            );
      
            fetch(`${endpoints().OtpAPI}/create`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                Authorization: sessionToken,
              },
              body: createData,
            })
              .then((res) =>{
                if (res && res.data && res.data.message) {
                    Toast.show(res.data.message, Toast.LONG);
                }
                return callback(null, res);
    
              } )
              .catch(error => {
                apiClient.handleError(error);
                return callback(error, null);
              });
             
          } catch (err) {
            return callback(err, null);
          }
    }

   static async validate(verificationData,callback) {
        try {
            apiClient.put(`${endpoints().OtpAPI}/validate`, verificationData,(error, res)=> {
                if (res && res.data && res.data.message) {
                    Toast.show(res.data.message, Toast.LONG);
                }
                return callback(error, res)
              })
        }
      catch (err) {
        return callback(err, null)
        }
    }
}

export default OTPService;