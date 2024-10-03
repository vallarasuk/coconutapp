import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class OrderTotalAmountService {
    async getTodayAmount(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().orderTotal}`, params)
          apiClient.get(apiUrl, (err, response) => {
            return callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
      }

}


  const orderTotalAmountService = new OrderTotalAmountService()
export default orderTotalAmountService;