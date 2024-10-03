import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import { ErrorMessage } from "../helper/ErrorMessage";

class ActivityService {
    
    async search(params, callback) {
        try {
          const queryString = [];
    
          let apiUrl;
    
          if (params) {
            Object.keys(params).forEach((param) => {
              queryString.push(`${param}=${params[param]}`);
            });
          }
    
          if (queryString && queryString.length > 0) {
            apiUrl = `${endpoints().ActivityAPI}/search?${queryString.join("&")}`;
          } else {
            apiUrl = `${endpoints().ActivityAPI}/search`;
          }
    
    
          apiClient
            .get(apiUrl, (error, response) => {
              return callback(null, response);
            })
        } catch (err) {
          return callback(err, null);
    
        }
      }

    async getActivityType(callback) {
        try {

            apiClient.get(`${endpoints().ActivityTypeApi}/search`, (error, response) => {
                if (response.data && response.data) {
                    return callback(null, response);
                }
            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }

    }


    async create(createData, callback) {

        apiClient.post(`${endpoints().ActivityAPI}`, createData, (error, response) => {
            if (response && response.data && response.data.message) {
                Toast.show(response.data.message, Toast.LONG);
            }
            return callback(null, response);

        })
    }
    async update(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().ActivityAPI}/${id}`, updateData,(error, res)=> {
                return callback(null, res)
          
              })
        }
      catch (err) {
            console.log(err);
        }
    }

    async updateStatus(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().ActivityAPI}/updateStatus/${id}`, updateData,(error, res)=> {
                return callback(null, res)
          
              })
        }
      catch (err) {
            console.log(err);
        }
    }


     async get(id,callback) {
      try {
          if (id) {

                  apiClient
                  .get(`${endpoints().activityAPI}/${id}`, (error, response) => {
                    return callback(null, response);
                  })
          }

      } catch (err) {
          console.log(err);
          return null;
      }
  }

  async delete(id, callback) {
    try {
        if (id) {
            apiClient.delete(`${endpoints().activityAPI}/${id}`, (error, res) => {
            return callback(null, res);
            })
        }
    } catch (err) {
        console.log(err);
        return callback(err, null);
    }
}
}
const activityService = new ActivityService()

export default activityService