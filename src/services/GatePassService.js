import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";


class GatePassService {

    async search(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().GatePassApi}/search`, params)
          apiClient.get(apiUrl, (err, response) => {
            return callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
      }
   

     async create( bodyData, callback) {
        try {
          let sessionToken = await AsyncStorage.getItem(
            AsyncStorageConstants.SESSION_TOKEN
          );
    
          fetch(`${endpoints().GatePassApi}/create`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: sessionToken,
            },
            body: bodyData,
          })
            .then((res) =>{
              return callback(null, res);
            } )
            .catch(error => {
            //   ErrorMessage(error, navigation)
              return callback(error, null);
            });
           
        } catch (err) {
          return callback(err, null);
        }
      }
    async update(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().GatePassApi}/update/${id}`, updateData,(error, res)=> {
                if (res && res.data && res.data.message) {
                }
                return callback(null, res)
          
              })
        }
      catch (err) {
            console.log(err);
        }
    }
    async delete(id,callback) {
        try {
            apiClient.delete(`${endpoints().GatePassApi}/delete/${id}`, (error, response)=> {
                if (response && response.data && response.data.message) {
                return callback(response.data.message);
                                }

          
              })
        }
      catch (err) {
            console.log(err);
        }
    }
}
const gatePassService = new GatePassService()
export default gatePassService;