
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class ProducPriceService {
   static async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().ProductPrice}`, bodyData,(error, res)=> {
                    return callback &&  callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }
   static async search(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().ProductPrice}/search`, params)
          apiClient.get(apiUrl, (error, response) => {

            callback && callback(response && response?.data && response?.data?.data);
    
          });
    
        } catch (err) {
          console.log(err);
        }
      }
     static async update(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().ProductPrice}/${id}`, updateData,(error, res)=> {

                return callback(null, res)
          
              })
        }
      catch (err) {
            console.log(err);
        }
    }
    static async delete(id,callback) {
        try {
            apiClient.delete(`${endpoints().ProductPrice}/${id}`, (error, response)=> {
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
export default ProducPriceService;