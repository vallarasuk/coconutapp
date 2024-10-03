import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { ErrorMessage } from "../helper/ErrorMessage";
import Url from "../lib/Url";

class CategoryService {


  async getCategoryList(setCategoryList, setLoading) {
    try {
      setLoading && setLoading(true);
      await apiClient.get(`${endpoints().categoryAPI}/list?pagination=false`,(error, response)=> {
        let category = new Array();
        let categoryList = response?.data?.data;
        if (categoryList && categoryList.length > 0) {
          for (let i = 0; i < categoryList.length; i++) {
            category.push({
              label: categoryList[i].name,
              value: categoryList[i].id,
            });
          }
        }
        // Set response in state
        setCategoryList && setCategoryList(category);
        setLoading && setLoading(false);
      })
    } catch (err) {
      console.log(err);
      setLoading && setLoading(false);
    }
  }

 async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().categoryAPI}/search`, params)
      apiClient.get(apiUrl, (error, response) => {

        callback && callback(response && response?.data && response?.data?.data);

      });

    } catch (err) {
      console.log(err);
    }
  }

}
const categoryService = new CategoryService();

export default categoryService;
