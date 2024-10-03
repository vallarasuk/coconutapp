
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { ErrorMessage } from "../helper/ErrorMessage";
import Url from "../lib/Url";

class BrandService {


  async getBrandList(setBrandList) {
    try {
      apiClient.get(`${endpoints().brandAPI}/list?pagination=false`, (error, response) => {
        let Brand = new Array();
        let brandList = response?.data?.data;
        if (brandList && brandList.length > 0) {
          for (let i = 0; i < brandList.length; i++) {
            Brand.push({
              label: brandList[i].name,
              value: brandList[i].id,
            });
          }
        }
        // Set response in state
        setBrandList && setBrandList(Brand);
      })
    } catch (err) {
      console.log(err);
    }
  }

 async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().brandAPI}/search`, params)
      apiClient.get(apiUrl, (error, response) => {

        callback && callback(response && response?.data && response?.data?.data);

      });

    } catch (err) {
      console.log(err);
    }
  }

}
const brandService = new BrandService();

export default brandService;
