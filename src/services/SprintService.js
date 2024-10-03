import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class SprintService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().sprintAPI}/list`, params)
      apiClient.get(apiUrl, (err, response) => {
        let sprintList = new Array();
        let sprint = response?.data?.data;
        if (sprint && sprint.length > 0) {
          for (let i = 0; i < sprint.length; i++) {
            sprintList.push({
              label: sprint[i].name,
              value: sprint[i].id,
            });
          }
        }
        // Set response in state
        callback && callback(sprintList);
      })

    } catch (err) {
      console.log(err);
    }
  }
 

}

export default SprintService;;