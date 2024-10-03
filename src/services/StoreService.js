

import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import { ErrorMessage } from "../helper/ErrorMessage";
import Url from "../lib/Url";
import Permission from "../helper/Permission";
import PermissionService from "../services/PermissionService";

class StoreService {

  // Get inventory transfer∂ß list
  async getStoreList(navigation, callback) {
    try {

      apiClient.get(`${endpoints().locationAPI}/search?status=Active`, (error, response) => {
        if (response) {
          return callback(null, response);
        }
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };

  async GetStoreByIpAddress(callback) {
    try {

      apiClient.get(`${endpoints().locationAPI}/ipAddress`, (error, response) => {
        if (response) {
          return callback(null, response);
        }
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };

  async GetStoreByGeoLocation(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().locationAPI}/geoLocation`, params)
      apiClient.get(apiUrl, (error, response) => {
        if (error) {
          console.error('Error:', error);
          callback && callback(null);
        } else {
          callback && callback(response?.data);
        }
      });
    } catch (err) {
      console.error('Error:', err);
      callback && callback(null);
    }
  }

  async get(storeId, callback) {
    try {
      apiClient.get(`${endpoints().locationAPI}/${storeId}`, (error, response) => {
        return callback(null, response);
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };

  async update(id,updateData,callback) {
  
    try {
        apiClient.put(`${endpoints().locationAPI}/${id}`, updateData,(error, res)=> {
           
            return callback(null, res)
      
          })
    }
  catch (err) {
        console.log(err);
    }
}


async create(bodyData, callback) {
  try {
    apiClient.post(`${endpoints().locationAPI}`, bodyData, (error, res) => {
      return callback(null, res)

    })
  }
  catch (err) {
    console.log(err);
  }
}


  async GetStoreList(params, callback) {

    try {
      let apiUrl;

      let queryString = [];
      if (params) {
        for (let key in params) {
          queryString.push(`${key}=${params[key]}`);
        }
      }
      if (queryString.length > 0) {
        apiUrl = `${endpoints().locationAPI}/search?${queryString.join("&")}`;
      } else {
        apiUrl = `${endpoints().locationAPI}/search`;
      }

      apiClient.get(apiUrl, (error, response) => {

        let storeList = new Array();
        let data = response?.data?.data;
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            storeList.push({
              label: data[i].name,
              value: data[i].id,
            });
          }
        }
        // Set response in state
        callback && callback(storeList);

      });

    } catch (err) {
      console.log(err);
    }
  }


  // Get inventory transfer∂ß list
  async list(params, callback) {
    try {
        let queryString = [];
        if (params) {
          for (let key in params) {
            queryString.push(`${key}=${params[key]}`);
          }
        }
        apiClient.get(`${endpoints().locationAPI}/list?${queryString?.join("&")}`, (error, response) => {
          if (response) {
            return callback(null, response);
          }
        })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };
  async getLocationByRole(callback) {
    try {
      apiClient.get(`${endpoints().locationAPI}/getLocationByRole`, (error, response) => {
        if (response) {
          return callback(null, response);
        }
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };


  processList = (storeList) => {
    const storeListOption = new Array();
    if (storeList && storeList.length > 0) {
      for (let i = 0; i < storeList.length; i++) {
        storeListOption.push({
          label: storeList[i].name,
          value: storeList[i].id,
        });
      }

      return storeListOption;
    }
  }

  async GetLocationByIpAndGeoLocation(params, callback) {
    try {
      apiClient.get( Url.get(`${endpoints().locationAPI}/getLocationByIPandGeoLocation`, params), (error, response) => {
        return callback(error, response);
      });
    } catch (err) {
      console.error('Error:', err);
      callback && callback(null); 
    }
  }

 async delete(id,callback) {
    try {
        apiClient.delete(`${endpoints().locationAPI}/${id}`, (error, response)=> {
            if (response && response.data && response.data.message) {
            return callback(response.data.message);
                            }

      
          })
    }
  catch (err) {
        console.log(err);
    }
}

}


const storeService = new StoreService();

export default storeService;