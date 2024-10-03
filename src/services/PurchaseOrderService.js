import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class PurchaseOrderService {

    async search(params, callback) {
        try {
            let apiUrl = await Url.get(`${endpoints().purchaseOrderAPI}/search`, params)
            apiClient.get(apiUrl, (error, response) => {

                callback && callback(response && response?.data && response?.data?.data);

            });

        } catch (err) {
            console.log(err);
        }
    }

 

    async create(createData, callback) {

        apiClient.post(`${endpoints().purchaseOrderAPI}`, createData, (error, response) => {
            return callback(null, response);

        })
    }

    async update(id, updateData, callback) {

        apiClient.put(`${endpoints().purchaseOrderAPI}/${id}`, updateData, (error, response) => {
            return callback(response);

        })
    }

    async Delete(id, callback) {
        try {
            if (id) {


                // apiClient
                apiClient.delete(`${endpoints().purchaseOrderAPI}/${id}`, (error, res) => {

                    return callback();
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

}
const purchaseOrderService = new PurchaseOrderService()

export default purchaseOrderService