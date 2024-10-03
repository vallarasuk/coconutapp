// Import React and Component
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "./SearchBar";
import Fuse from "fuse.js";
import ArrayList from "../lib/ArrayList";
import activityService from "../services/ActivityService";
import ListUI from "./ListUI";

const ActivityTypeSelector = (props) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const [activityTypeList, setActivityTypeList] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    getActivityTypeList(true);
  }, [isFocused]);

  const getActivityTypeList = () => {
    let activityList = new Array();
    activityService.getActivityType((error, response) => {
      let activityTypeList = response?.data?.data;
      for (let i = 0; i < activityTypeList.length; i++) {
        activityList.push({
          value: activityTypeList[i].id,
          label: activityTypeList[i].name,
          type: activityTypeList[i].type,
        });
      }
      setActivityTypeList(activityList);
    });
  };

  const handleChange = async (search) => {
    if (search) {
      let typeData = new Array();

      const fuseOptions = {
        keys: ["label"],
      };

      const searchType = new Fuse(activityTypeList, fuseOptions);

      let results = searchType.search(search);

      if (ArrayList.isNotEmpty(results)) {
        for (let i = 0; i < results.length; i++) {
          typeData.push({
            value: results[i].item.value,
            label: results[i].item.label,
            type: results[i].item.type,
          });
        }
      }
      setActivityTypeList(typeData);
    } else {
      getActivityTypeList(false);
    }
  };

  return (
    <>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        setClicked={setClicked}
        clicked={clicked}
        onPress={getActivityTypeList}
        handleChange={handleChange}
        noScanner
      />
      <ScrollView>
        <ListUI
          List={activityTypeList}
          selectProperty={"label"}
          onPress={props.onPress}
        />
      </ScrollView>
    </>
  );
};

export default ActivityTypeSelector;
