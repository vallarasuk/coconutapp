import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";



class ReplenishmentReportService {

    static async search(params, callback) {
        try {
            const queryString = [];

            let apiUrl;

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString && queryString.length > 0) {
                apiUrl = `${endpoints().replenishmentAllocationAPI}/report?${queryString.join("&")}`;
            } else {
                apiUrl = `${endpoints().replenishmentAllocationAPI}/report`;
            }

            apiClient.get(apiUrl, (err, response) => {
                return callback(err, response)
            });


        } catch (err) {
            console.log(err)
        }
    }
}
export default ReplenishmentReportService;