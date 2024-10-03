import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class CustomerService {
  async searchByUser(params,  callback) {
    try {
      if (params) {
        let orderObj;
        let orderData = [];
        let productName;

        apiClient
          .get(Url.get(`${endpoints().customerRoute}/order/search`, params) , (error, response) => {

            if (response && response.data && response.data.data) {
             
              orderObj = response.data.data;

              if (orderObj && orderObj.length > 0) {

                  for (let i = 0; i < orderObj.length; i++) {

                      if (orderObj[i].orderProducts && orderObj[i].orderProducts.length > 0) {
                          productName = orderObj[i].orderProducts.map((data) => data.productIndex && data.productIndex.product_name)
                      }

                      orderData.push({
                          orderId: orderObj[i].id,
                          order_number: orderObj[i].order_number,
                          total_amount: orderObj[i].total_amount,
                          productName: productName && productName.length > 0 && productName.toString(),
                          date: orderObj[i].date,
                          status: orderObj[i].status,
                          statusColor: orderObj[i].colorCode,
                      })
                  }
              }

            }
            return callback(null, orderData);
          })
      }
    } catch (err) {
      return callback(err, null);
    }
  }


}

const customerService = new CustomerService();

export default customerService;
