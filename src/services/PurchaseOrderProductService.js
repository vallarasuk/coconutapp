import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";
import Url from "../lib/Url";

class PurchaseOrderProductService {

  

    async getProductList(params, callback) {
        try {
            let apiUrl = await Url.get(`${endpoints().purchaseOrderProductAPI}/search`, params)
            apiClient.get(apiUrl, (error, response) => {
                callback && callback(response && response?.data);

            });

        } catch (err) {
            console.log(err);
        }
    }

  



}
const purchaseOrderProductService = new PurchaseOrderProductService()

export default purchaseOrderProductService