import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class LocationAllocationUserService{

    static async create(bodyData, callback) {
        try {
            if (bodyData) {
                apiClient.put(`${endpoints().LocationAllocationUserAPI}`, bodyData, (error, res) => {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }

    static async search(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().LocationAllocationUserAPI}/search`, params)
          apiClient.get(apiUrl, (err, response) => {
            return callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
      }

      static async updateStatus(updateData, callback) {
        try {
            apiClient.put(`${endpoints().LocationAllocationUserAPI}/statusUpdate`, updateData, (error, res) => {
                return callback(null, res)
            })
        }
        catch (err) {
            console.log(err);
        }
    }



}
export default LocationAllocationUserService;