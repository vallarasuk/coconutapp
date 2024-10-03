import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class OrderTypeService {

  static async list(params, callback) {
    try {
      let apiUrl = await Url.get(
        `${endpoints().orderTypeAPI}/list`,
        params
      );

      apiClient.get(apiUrl, (err, response) => {
        callback && callback(response);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default OrderTypeService;
