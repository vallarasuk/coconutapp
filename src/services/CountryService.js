import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class CountryService {
    
    async list(params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().countryAPI}/list`, params)
          apiClient.get(apiUrl, (error, response) => {
            let list = new Array();
            let data = response?.data?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push({
                        label: data[i].name,
                        value: data[i].name,
                        id : data[i].id
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
      async getStateList(selectedCountry,params, callback) {
        try {
          let apiUrl = await Url.get(`${endpoints().countryAPI}/${selectedCountry}${params}`)
          apiClient.get(apiUrl, (error, response) => {
            let list = new Array();
            let data = response?.data?.data;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    list.push({
                        label: data[i].name,
                        value: data[i].name,
                        id : data[i].id
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
    

}

const countryService = new CountryService();

export default countryService;