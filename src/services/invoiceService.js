import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class InvoiceService {
  async create(bodyData, callback) {
    try {
      apiClient.post(
        `${endpoints().invoiceAPI}/createRefund`,
        bodyData,
        (error, res) => {
          return callback(null, res);
        }
      );
    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  }
  
   async search(params, callback) {
    try {
      let apiUrl = await Url.get(
        `${endpoints().invoiceAPI}`,
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

const invoiceService = new InvoiceService()
export default invoiceService;
