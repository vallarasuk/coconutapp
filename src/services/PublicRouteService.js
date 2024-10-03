import Toast from "react-native-toast-message";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";


class PublicRouteService {

    static async getProducts(params, callback) {
        try {

            const queryString = [];

            let apiUrl = `${endpoints().PublicRoute}/product`

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString.length > 0) {
                apiUrl = `${apiUrl}?${queryString.join("&")}`;
            }

            apiClient.public("get", apiUrl, null, (error, res) => {
                return callback(null, res);
            })
        } catch (err) {
            Toast.show(err.message, Toast.LONG);
            console.log(err);
            return callback(err, []);
        }
    }

    static async getCategories(params, callback) {
        try {

            const queryString = [];

            let apiUrl = `${endpoints().PublicRoute}/categories`

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString.length > 0) {
                apiUrl = `${apiUrl}?${queryString.join("&")}`;
            }

            apiClient.public("get", apiUrl,null, (error, res) => {
                return callback(null, res);
            })
        } catch (err) {
            Toast.show(err.message, Toast.LONG);
            console.log(err);
            return callback(err, []);
        }

    }

    static async createAccount(bodyData, callback) {
        try {
            apiClient.public("post", `${endpoints().PublicRoute}/account`, bodyData, (error, res) => {
                return callback(null, res);
            })
        } catch (err) {
            Toast.show(err.message, Toast.LONG);
            console.log(err);
            return callback(err, []);
        }

    }


    static async getJobs(callback){
        await apiClient.public("get",`${endpoints().PublicRoute}/jobs`,null,(err,response)=>{
            const data = response && response.data && response.data.data;
            return callback && callback(data);
        });
}

  
  static async createCandidate(bodyData, callback) {
    try {
        apiClient.public("post", `${endpoints().PublicRoute}/candidate/create`, bodyData, (error, res) => {
            return callback(null, res);
        })
    } catch (err) {
        Toast.show(err.message, Toast.LONG);
        console.log(err);
        return callback(err, []);
    }

}


static createMedia(bodyData, callback) {
    try {

      fetch(`${endpoints().PublicRoute}/media/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: bodyData,
      })
        .then(res => res.json())
        .then(response => {
          return callback(null, response);
        })
        .catch(error => {
            Toast.show(error.message, Toast.LONG);
          return callback(error, null);
        });
    } catch (err) {
      return callback(err, null);
    }
  }
}

export default PublicRouteService;