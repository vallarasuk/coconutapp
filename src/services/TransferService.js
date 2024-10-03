import { endpoints } from "../helper/ApiEndPoint";

import apiClient from "../apiClient";
import Url from "../lib/Url";

class TransferService {
    async getTransferProductReportByUserWise(params,callback) {

        try {
          let apiUrl = await Url.get(`${endpoints().transferProduct}/userWiseReport`, params)
          apiClient.get(apiUrl, (err, response) => {
            return callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
  
  }
}
const transferService = new TransferService();

export default transferService