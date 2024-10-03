// Import React and Component
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SearchBar from "./SearchBar";
import Fuse from "fuse.js";
import ArrayList from "../lib/ArrayList";
import ListUI from "./ListUI";
import ProjectService from "../services/ProjectService";
import Layout from "./Layout";
import ticketTypeService from "../services/TicketTypeService";
import Status from "../helper/Status";

const TicketTypeSelector = (props) => {
    const {projectId} = props && props.route && props.route.params && props.route.params
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const [ticketTypeList, setTicketTypeList] = useState([]);

  const isFocused = useIsFocused();
  const navigation = useNavigation()   

  useEffect(() => {
    getTicketTypeList();
  }, [isFocused,projectId]);

  const getTicketTypeList = () => {
    ticketTypeService.search({projectId : projectId ? projectId : "",status : Status.ACTIVE}, (err, response) => {

        let data = response && response?.data && response?.data?.data;
        let list = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const { id, name, default_story_point, userId } = data[i];
                list.push({
                    label: name,
                    value: id,
                    default_story_point: default_story_point,
                    userId: userId

                });
            }
        }

        setTicketTypeList(list);
    });
}

const onPress = (value) => {     
    navigation.navigate("Ticket/Add",{projectId : projectId && projectId , ticketTypeValue : value});
}

  const handleChange = async (search) => {
    if (search) {
      let typeData = new Array();

      const fuseOptions = {
        keys: ["label"],
      };

      const searchType = new Fuse(ticketTypeList, fuseOptions);

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
      setTicketTypeList(typeData);
    }
  };

  return (
    <>
    <Layout title = {"Ticket Type Select"} showBackIcon={false}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        setClicked={setClicked}
        clicked={clicked}
        onPress={getTicketTypeList}
        handleChange={handleChange}
        noScanner
      />
      <ScrollView>
        <ListUI
          List={ticketTypeList}
          selectProperty={"label"}
          onPress={onPress}
        />
      </ScrollView>
      </Layout>
    </>
  );
};

export default TicketTypeSelector;
