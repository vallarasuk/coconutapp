import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from "react-native-simple-toast";
import AlertModal from "../components/Alert";

class SaleSettlementService {
  async create(createData, callback) {
    try {
      if (createData) {

        let salesCreate = `${endpoints().SaleSettlementAPI}`;

        apiClient
          .post(salesCreate, createData, (error, response) => {
            if (response.data) {
              if (response.data.message) {
                Toast.show(response.data.message, Toast.LONG);
              }

              return callback(null, response)
            }
          })
      }
    } catch (err) {

    }
  }

  async ValidateSalesSettlementOnAdd(callback) {
      try {

        apiClient.get(`${endpoints().SaleSettlementAPI}/ValidationSalesSettlementOnAdd`, (error, response) => {
            if (response.data && response.data) {
                return callback(null, response);
            }
        })

    } catch (err) {
        console.log(err);
        return callback(err, []);
    }
  }


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
        apiUrl = `${endpoints().SaleSettlementAPI}/list?${queryString.join("&")}`;
      } else {
        apiUrl = `${endpoints().SaleSettlementAPI}/list`;
      }


      apiClient
        .get(apiUrl, (error, response) => {
          return callback(null, response);
        })
    } catch (err) {
      return callback(err, null);

    }
  }

  async update(id, updateData, callback) {

    apiClient.put(`${endpoints().SaleSettlementAPI}/${id}`, updateData,(error, response)=> {
      if (response && response.data && response.data.message) {
        Toast.show(response.data.message, Toast.LONG);
      }
      return callback(response);

    })
  }
  async updateStatus(id, data, callback) {
    let sessionToken = await AsyncStorage.getItem(
      AsyncStorageConstants.SESSION_TOKEN
    );

    apiClient.defaults.headers.common["Authorization"] = sessionToken;
    apiClient.put(`${endpoints().SaleSettlementAPI}/status/${id}`, data,(error, response)=> {
      if (response && response.data && response.data.message) {
        Toast.show(response.data.message, Toast.LONG);
      }
      return callback(response.data.message);

    })
  }
  async delete(id,callback) {
    try {
        apiClient.delete(`${endpoints().SaleSettlementAPI}/${id}`, (error, response)=> {
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

const saleSettlementService = new SaleSettlementService();

export default saleSettlementService;
