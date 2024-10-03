import { endpoints } from "../helper/ApiEndPoint";

import apiClient from "../apiClient";


class ReplenishService {

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
                apiUrl = `${endpoints().ReplenishmentAPI}/search?${queryString.join("&")}`;
            } else {
                apiUrl = `${endpoints().ReplenishmentAPI}/search`;
            }

            apiClient.get(apiUrl, (err, response) => {
                return callback(err, response)
            });


        } catch (err) {
            console.log(err)
        }
    }

    static async getPendingList(callback) {
        try {
            let apiUrl = `${endpoints().ReplenishmentAPI}/search`;

            apiClient.get(apiUrl, (err, response) => {

                return callback(err, response && response.data && response.data.data)
            });

        } catch (err) {
            console.log(err)
        }
    }
}

export default ReplenishService;