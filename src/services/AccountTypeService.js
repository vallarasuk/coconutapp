import Url from "../lib/Url";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";

class AccountTypeService{
    async search(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().accountTypeAPI}/search`, params)
          apiClient.get(apiUrl, (error, response) => {

            let list = new Array();
            let data = response?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
            }
            callback && callback(list);
    
          });
    
        } catch (err) {
          console.log(err);
        }
      }
   
    async list(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().accountTypeAPI}`, params)
          apiClient.get(apiUrl, (error, response) => {

            let list = new Array();
            let data = response?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push(data[i]);
                }
            }
            callback && callback(list);
    
          });
    
        } catch (err) {
          console.log(err);
        }
      }
    }
const accountTypeService = new AccountTypeService()
export default accountTypeService;