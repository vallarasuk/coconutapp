import { endpoints } from "../helper/ApiEndPoint";

import apiClient from "../apiClient";
import Url from "../lib/Url";

class StockEntryReportService {
    async getReport(params,callback) {

        try {
          let apiUrl = await Url.get(`${endpoints().stockEntryReportApi}/search`, params)
          apiClient.get(apiUrl, (err, response) => {
            return callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
  
  }
}
const stockEntryReportService = new StockEntryReportService();

export default stockEntryReportService