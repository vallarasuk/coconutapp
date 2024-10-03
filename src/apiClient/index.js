import axios from "axios";

import AsyncStorage from "../lib/AsyncStorage";

import AsyncStorageConstants from "../helper/AsyncStorage";

import { navigate } from "../lib/RootNavigation";

import Network from "../lib/NetworkStatus";

import AlertMessage from "../helper/AlertMessage";

import Alert from "../lib/Alert";

import { api_url, defaultAPIKey } from "../../config";

const axiosClient = axios.create({
  baseURL: api_url,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    common: {
      //set token for authorization
      Authorization: "",
    },
  },
});


class apiClient {

  static handleError(error) {
    try {
      console.log("API error", error)

      let errorMessage;

      const errorRequest = error?.response?.request;

      const statusCode = error?.response?.status;

      if (statusCode == Network.FORBIDDEN) {
        errorMessage = JSON.parse(errorRequest.response).message;
        alert(errorMessage);
      }


      if (statusCode == Network.STATUS_BAD_REQUEST && errorRequest && errorRequest.response && statusCode != Network.STATUS_BAD_GATEWAY) {
        errorMessage = JSON.parse(errorRequest.response).message;
        Alert.Error(errorMessage);
      }


      if (statusCode == Network.STATUS_BAD_GATEWAY) {
        Alert.Error(AlertMessage.NETWORK_UNAUTHORIZED_ERROR);

      }

      if (statusCode == Network.STATUS_UNAUTHORIZED) {
        AsyncStorage.clearAll();
        navigate("Login", {});
      }

      if (statusCode == Network.STATUS_SERVICE_UNAVAILABLE) {
        Alert.Error(AlertMessage.NETWORK_SERVICE_UNAVAILABLE_ERROR);
      }

      if (statusCode == Network.STATUS_INTERNAL_SERVER_ERROR) {
        Alert.Error(AlertMessage.SERVER_ERROR);
      }

    } catch (err) {
      console.log(err);
    }
  }

  static async post(url, body, callback) {
    try {

      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );

      axiosClient.defaults.headers.common["Authorization"] = sessionToken;

      axiosClient.post(url, body).then(async (response) => {

        return callback(null, response);

      }).catch((error) => {
        this.handleError(error);
        return callback(error, null)
      })
    } catch (err) {
      console.log(err);
      return callback(err, null)
    }
  }

  static async get(url, callback) {
    try {
      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );
      if (!sessionToken) {
        return callback(null, null)
      }
      axiosClient.defaults.headers.common["Authorization"] = sessionToken;

      axiosClient.get(url).then(async (response) => {

        return callback(null, response);

      }).catch((error) => {
        this.handleError(error);
        return callback(error, null)
      })
    } catch (err) {
      console.log(err);
      return callback(err, null)
    }
  }

  static async put(url, body, callback) {
    try {

      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );

      axiosClient.defaults.headers.common["Authorization"] = sessionToken;

      axiosClient.put(url, body).then(async (response) => {

        return callback(null, response);

      }).catch((error) => {
        this.handleError(error);
        return callback(error, null)
      })
    } catch (err) {
      console.log(err);
      return callback(err, null)
    }
  }

  static async delete(url, callback) {
    try {

      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );

      axiosClient.defaults.headers.common["Authorization"] = sessionToken;

      axiosClient.delete(url).then(async (response) => {

        return callback(null, response);

      }).catch((error) => {
        this.handleError(error);
        return callback(error, null)
      })
    } catch (err) {
      console.log(err);
      return callback(err, null)
    }
  }

  static async fetch(url, bodyData, callback) {
    try {
      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );

      axios.post(url, bodyData, {
        headers: {
          Authorization: sessionToken,
          'Content-Type': 'multipart/form-data'
        },
      })
        .then(response => {
          return callback(null, response);
        })
        .catch(error => {
          console.log(error);
          this.handleError(error);
          return callback(error, null)
        });
    } catch (err) {
      console.log(err);
      return callback(err, null)
    }
  }

  static async public(method, url, bodyData, callback) {
    try {

      let axiosObj = {
        headers: {
          'Content-Type': "application/json",
          Authorization: defaultAPIKey
        },
      };

      let config = {
        ...axiosObj
      };

      if (bodyData) {
        config.data = bodyData;
      }

      if (method === 'get') {
        axios[method](url, config)
          .then(response => {
            return callback(null, response);
          })
          .catch(error => {
            return callback(error, null);
          });
      } else {
        axios[method](url, bodyData, config)
          .then(response => {
            return callback(null, response);
          })
          .catch(error => {
            this.handleError(error);
            return callback(error, null);
          });
      }
    } catch (err) {
      console.log(err);
      return callback(err, null)
    }
  }
}

export default apiClient;



