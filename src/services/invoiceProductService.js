import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class InvoiceProductService {
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
        `${endpoints().invoiceProductAPI}`,
        params
      );
      apiClient.get(apiUrl, (err, response) => {
        if(response && response.data && response.data.data){
        callback && callback(response.data.data)}
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const invoiceProductService = new InvoiceProductService()
export default invoiceProductService;
