import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class PurchaseProductService {

    async search(params, callback) {
        try {
            let purchaseProducts = new Array();

            let apiUrl = await Url.get(`${endpoints().PurchaseProductAPI}/search`, params)
            apiClient.get(apiUrl, (error, res) => {

                if (res && res.data && res.data.data) {

                    let purchaseProductList = res.data.data;

                    let totalCount = res.data.totalCount

                    if (purchaseProductList && purchaseProductList.length > 0) {


                        for (let i = 0; i < purchaseProductList.length; i++) {

                          

                            purchaseProducts.push(
                               
                               purchaseProductList[i]
                            )

                        }
                        return callback(null, purchaseProducts, totalCount);

                    } else {
                        return callback(null, []);
                    }
                }
            })


        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }

    async create(objectData, callback) {
        try {
            if (objectData) {

                let purchaseProduct = `${endpoints().PurchaseProductAPI}`;

                apiClient.post(purchaseProduct, objectData, (error, res) => {

                    return callback(null, res);
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async update(objectData, purchaseProductId, callback) {
        try {
            if (objectData) {

                let purchaseProduct = `${endpoints().PurchaseProductAPI}/update/${purchaseProductId}`;

                apiClient.put(purchaseProduct, objectData, (error, res) => {

                    return callback(null, res);
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async delete(purchaseProductId, callback) {
        try {
            if (purchaseProductId) {


                let purchaseProduct = `${endpoints().PurchaseProductAPI}/${purchaseProductId}`;

                apiClient.delete(purchaseProduct, (error, res) => {

                    return callback();

                })
            }

        } catch (err) {
            console.log(err);
        }
    }

}
const purchaseProductService = new PurchaseProductService()

export default purchaseProductService
