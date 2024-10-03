import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import ErrorMessage from "../components/error";

class VisitorService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().VisitorApi}/search`, params)
      apiClient.get(apiUrl, (err, response) => {
        // Set response in state
        callback && callback(response);
      });

    } catch (err) {
      console.log(err);
    }
  }
 
  static async update(id, updateData, callback) {
    apiClient.put(`${endpoints().VisitorApi}/${id}`, updateData, (error, response) => {      
     callback && callback(response);

    })
  }


  static async create( bodyData, callback) {
      try {

        apiClient.fetch(`${endpoints().VisitorApi}`, bodyData, (error, response) => {
          return callback && callback(null, response);
      })

    } catch (err) {
      return callback(err, null);
    }
  }


}



export default VisitorService;;