import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";

class WhatsappService {

    static async orderInvoice(bodyData, callback) {
        try {
          if (bodyData) {
    
            let share = `${endpoints().WhatsappAPI}/sendOrderMessage`;
    
            apiClient
              .post(share, bodyData, (error, response) => {
    
                if (response && response.data) {
                  return callback(null, response)
                }
              })
          }
        } catch (err) {
    
        }
      }

}
export default WhatsappService