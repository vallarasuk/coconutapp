import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";




class PublicPageBlockService{

    static async get(callback){
            await apiClient.public("get",`${endpoints().publicPageBlockAPI}`,null,(err,response)=>{
                const data = response && response.data && response.data.data;
                return callback && callback(data);
            });
    }
}

export default PublicPageBlockService;