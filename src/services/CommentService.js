

import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class CommentService {

    static async create(id, bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().Comment}/${id}`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }
    static async search(params, callback) {
        try {
            let apiUrl = await Url.get(`${endpoints().Comment}/search`, params)
            apiClient.get(apiUrl, (err, response) => {
                // Set response in state
                callback && callback(response);
            });

        } catch (err) {
            console.log(err);
        }
    }
    static async delete(id, comment_id, callback) {
        try {
            if (id) {

                apiClient
                    .delete(`${endpoints().Comment}/${id}/${comment_id}`, (error, res) => {
                        return callback(null, res);
                    })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }
    static async update(messageId, bodyData, callback) {
        apiClient.put(`${endpoints().Comment}/${messageId}`, bodyData, (error, response) => {
            return callback(response);
        })
    }
}


export default CommentService;