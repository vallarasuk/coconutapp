import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";




class RecurringTaskService{
    
      async create(bodyData, callback) {
        try {
            if (bodyData) {
                apiClient.post(`${endpoints().RecurringTaskAPI}`, bodyData,(error, res)=> {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }

    async search(params, callback) {
      try {
        let apiUrl = await Url.get(`${endpoints().RecurringTaskAPI}/search`, params)
        apiClient.get(apiUrl, (err, response) => {
          return callback(null,response && response.data && response.data.data);
        });
  
      } catch (err) {
        console.log(err);
      }
    }
    async update(id,updateData,callback) {
      try {
          apiClient.put(`${endpoints().RecurringTaskAPI}/${id}`, updateData,(error, res)=> {
             
              return callback(null, res)
        
            })
      }
    catch (err) {
          console.log(err);
      }
  }

  async delete(id,callback) {
    try {
        apiClient.delete(`${endpoints().RecurringTaskAPI}/${id}`, (error, response)=> {
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
const recurringTaskService = new RecurringTaskService()
export default recurringTaskService;