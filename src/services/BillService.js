import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { getFullName } from "../lib/Format";
import Url from "../lib/Url";


class BillService {

    async search(params, callback) {
        try {
            let apiUrl = await Url.get(`${endpoints().billAPI}/search`, params)
            apiClient.get(apiUrl, (error, response) => {


                callback && callback(response?.data);

            });

        } catch (err) {
            console.log(err);
        }
    }



    async create(bodyData, callback) {
        try {
            if (bodyData) {
                apiClient.post(`${endpoints().billAPI}`, bodyData,(error, res)=> {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }

    async update(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().billAPI}/${id}`, updateData,(error, res)=> {

                return callback(null, res)

            })
        }
        catch (err) {
            console.log(err);
        }
    }

    async Delete(id, callback) {
        try {
            if (id) {
                apiClient.delete(`${endpoints().billAPI}/delete/${id}`, (error, response) => {
                    if (response && response.data && response.data.message) {
                        return callback(response.data.message);
                    }
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async updatStatus(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().billAPI}/status/${id}`, updateData,(error, res)=> {

                return callback(null, res)

            })
        }
        catch (err) {
            console.log(err);
        }
    }

}

const billService = new BillService();

export default billService;