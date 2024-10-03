import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class AttendanceReportLocationWiseService {
    static async search(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().locationWiseAttendanceAPI}`, params)
          apiClient.get(apiUrl, (err, response) => {
            callback && callback(null,response);
          });
    
        } catch (err) {
          console.log(err);
        }
      }
     
}

export default AttendanceReportLocationWiseService;;