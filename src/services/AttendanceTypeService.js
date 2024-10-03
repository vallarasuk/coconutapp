import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { getFullName } from "../lib/Format";
import Url from "../lib/Url";


class AttendanceTypeServie {
    
    async search(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().attendanceTypeAPI}/search`, params)
          apiClient.get(apiUrl, (error, response) => {

            let list = new Array();
            let data = response?.data?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push({
                        label : data[i].type.label,
                        value :data[i].type.value
                    });
                }
            }
            // Set response in state
            callback && callback(list);
    
          });
    
        } catch (err) {
          console.log(err);
        }
      }
      async list(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().attendanceTypeAPI}`, params)
          apiClient.get(apiUrl, (error, response) => {

            let list = new Array();
            let data = response?.data?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
            }
            // Set response in state
            callback && callback(list);
    
          });
    
        } catch (err) {
          console.log(err);
        }
      }

      async leaveType(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().attendanceTypeAPI}/leaveType`, params)
          apiClient.get(apiUrl, (error, response) => {

            let list = new Array();
            let data = response?.data?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
            }
            // Set response in state
            callback && callback(list);
    
          });
    
        } catch (err) {
          console.log(err);
        }
      }
}
    
const attendanceTypeServie = new AttendanceTypeServie();

export default attendanceTypeServie;