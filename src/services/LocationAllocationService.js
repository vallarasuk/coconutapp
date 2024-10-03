import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class LocationAllocationService{
    static async create(bodyData, callback) {
        try {
            if (bodyData) {
                apiClient.post(`${endpoints().LocationAllocationAPI}/create`, bodyData,(error, res)=> {
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
          let apiUrl = await Url.get(`${endpoints().LocationAllocationAPI}/search`, params)
          apiClient.get(apiUrl, (err, response) => {
            return callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
      }

      static async delete(id,callback) {
        try {
            apiClient.delete(`${endpoints().LocationAllocationAPI}/delete/${id}`, (error, response)=> {
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
export default LocationAllocationService;