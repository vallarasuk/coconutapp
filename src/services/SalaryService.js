import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import ArrayList from "../lib/ArrayList";
import Url from "../lib/Url";


class SalaryService {


    static search(params, callback){
        try {
            let apiUrl;

            let queryStrings = ArrayList.toQueryString(params)
      
            if (queryStrings && queryStrings.length > 0) {
              apiUrl = `${endpoints().salaryAPI}/search?${queryStrings.join("&")}`;
            } else {
              apiUrl = `${endpoints().salaryAPI}/search`;
            }
      
            apiClient
              .get(apiUrl, (error, response) => {
                return callback(null, response);
              })
          } catch (err) {
            return callback(err, null);
      
          }

    }
}

export default SalaryService;