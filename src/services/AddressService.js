import apiClient from "../apiClient";

import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";
class AddressServices {
  async search(params, callback) {

    try {
      let apiUrl;

      let queryString = [];
      if (params) {
        for (let key in params) {
          queryString.push(`${key}=${params[key]}`);
        }
      }
      if (queryString.length > 0) {
        apiUrl = `${endpoints().addressAPI}/search?${queryString.join("&")}`;
      } else {
        apiUrl = `${endpoints().addressAPI}/search`;
      }

      apiClient.get(apiUrl, (error, response) => {
        let addressList = new Array();
        let data = response?.data?.data;
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let title = data[i].title ? data[i].title : "";
            let name = data[i].name ? data[i].name : "";

           if (title || name) {
              addressList.push({
              label: `${title}${title && name ? ", " : ""}${name ? `(${name})` : ""}`,
              value: data[i].id,
              id: data[i].id
             });
  }
        }
      }
        // Set response in state
        callback && callback(addressList);
      });

    } catch (err) {
      console.log(err);
    }
  }

  async searchAddress(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().addressAPI}/search`, params)
      apiClient.get(apiUrl, (err, response) => {
        return callback(null, response);
      });

    } catch (err) {
      console.log(err);
    }
  }
  async create(bodyData, callback) {
    try {
      apiClient.post(`${endpoints().addressAPI}`, bodyData, (error, res) => {

        return callback(null, res)

      })
    }
    catch (err) {
      console.log(err);
    }
  }

  async update(id, bodyData, callback) {
    try {
      apiClient.put(`${endpoints().addressAPI}/${id}`, bodyData, (error, res) => {

        return callback(null, res)

      })
    }
    catch (err) {
      console.log(err);
    }
  }

  async delete(id, callback) {
    try {
      apiClient.delete(`${endpoints().addressAPI}/${id}`, (error, res) => {

        return callback(null, res)

      })
    }
    catch (err) {
      console.log(err);
    }
  }

}
const addressServices = new AddressServices;

export default addressServices;