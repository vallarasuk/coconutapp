const { default: apiClient } = require("../apiClient");
const { endpoints } = require("../helper/ApiEndPoint");
const { default: Url } = require("../lib/Url");



class ContactService {
    static async search(params, callback) {
        try {
            let apiUrl = await Url.get(`${endpoints().contactAPI}/search`, params)
            apiClient.get(apiUrl, (err, response) => {
              return callback(response.data.data);
            });
      
          } catch (err) {
            console.log(err);
          }
    }

    static update(id, updateData, callback) {
      try {
        apiClient.put(`${endpoints().contactAPI}/update/${id}`,updateData,(error, res) => {
            if (res && res.data && res.data.message) {
              // Toast.show(res.data.message, Toast.LONG);
            }
            return callback(res);
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    static create(bodyData, callback) {
      try {
        apiClient.post(`${endpoints().contactAPI}`, bodyData, (error, res) => {
          return callback(res);
        });
      } catch (err) {
        console.log(err);
      }
    }

    static delete(id, callback) {
      try {
        apiClient.delete(`${endpoints().contactAPI}/delete/${id}`, (error, response) => {
          if (response && response.data && response.data.message) {
            return callback(response.data.message);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
}
module.exports = ContactService;