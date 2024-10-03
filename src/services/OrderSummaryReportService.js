import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class OrderSummaryReportService {

  static async list(params, callback) {
    try {
      let apiUrl = await Url.get(
        `${endpoints().orderSummaryReportAPI}/search`,
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

export default OrderSummaryReportService;
