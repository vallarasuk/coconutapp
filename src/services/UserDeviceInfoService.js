
import axios from "axios";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class UserDeviceInfoService {
  async create(bodyData, token, callback) {
    try {
      if (bodyData) {

        axios({
          method: 'post',
          url: `${endpoints().UserDeviceInfoApi}/create`,
          data: bodyData,
          headers: {
            "Content-Type": "application/json",
            common: {
              Authorization: token,
            },
          },
        }).then((response) => {
          return callback(null, response)
        }).catch(error => {
          console.log(error);
          apiClient.handleError(error);
          return callback(error, null)
        });
      }
    } catch (err) {
      console.log(err);
      return callback(err, "")
    }
  }
  async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().UserDeviceInfoApi}/search`, params);
      apiClient.get(apiUrl, (err, response) => {
        return callback(null, response);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async isExist(params, token, callback) {
    try {

      const queryString = [];

      if (params) {
          Object.keys(params).forEach((param) => {
              queryString.push(`${param}=${params[param]}`);
          });
      }

      axios({
        method: 'get',
        url: `${endpoints().UserDeviceInfoApi}/isExist?${queryString.join("&")}`,
        headers: {
          "Content-Type": "application/json",
          common: {
            //set token for authorization
            Authorization: token,
          },
        },
      }).then((response) => {
        return callback(null, response)
      }).catch(error => {
        console.log(error);
        apiClient.handleError(error);
        return callback(error, null)
      });

    } catch (err) {
      console.log(err);
      return callback(err, "")
    }
  }
}
const userDeviceInfoService = new UserDeviceInfoService();
export default userDeviceInfoService;