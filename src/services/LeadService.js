import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";




class LeadService{
    
      async create(bodyData, callback) {
        try {
            if (bodyData) {
                apiClient.post(`${endpoints().LeadApi}/create`, bodyData,(error, res)=> {
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
        let apiUrl = await Url.get(`${endpoints().LeadApi}/search`, params)
        apiClient.get(apiUrl, (err, response) => {
          return callback(null,response);
        });
  
      } catch (err) {
        console.log(err);
      }
    }
    async update(id,updateData,callback) {
      try {
          apiClient.put(`${endpoints().LeadApi}/update/${id}`, updateData,(error, res)=> {
             
              return callback(null, res)
        
            })
      }
    catch (err) {
          console.log(err);
      }
  }
  async updateStatus(id,status,callback) {
    try {
        apiClient.put(`${endpoints().LeadApi}/status/${id}`, status,(error, res)=> {
         
            return callback(null, res)
      
          })
    }
  catch (err) {
        console.log(err);
    }
}
  async delete(id,callback) {
    try {
        apiClient.delete(`${endpoints().LeadApi}/delete/${id}`, (error, response)=> {
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
const leadService = new LeadService()
export default leadService;