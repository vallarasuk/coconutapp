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

const ProjectSelector = (props) => {
  const {ticketTypeValue} = props && props.route && props.route.params && props.route.params  

  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const [projectList, setProjectList] = useState([]);

  const isFocused = useIsFocused();
  const navigation = useNavigation()


  useEffect(() => {
    getProjectList(true);
  }, [isFocused]);

  const getProjectList = () => {
    ProjectService.list(null,(response) => {
        setProjectList(response);

    })
}
const onPress = (value) => {    
  if(ticketTypeValue){
    navigation.navigate("Ticket/Add",{projectId : value && value.value , ticketTypeValue : ticketTypeValue});
  }else{
    navigation.navigate("ticketTypeSelector",{projectId : value && value.value });

  }
}

  const handleChange = async (search) => {
    if (search) {
      let typeData = new Array();

      const fuseOptions = {
        keys: ["label"],
      };

      const searchType = new Fuse(projectList, fuseOptions);

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
      setProjectList(typeData);
    }
  };

  return (
    <>
    <Layout title = {"Select Project"} >
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        setClicked={setClicked}
        clicked={clicked}
        onPress={getProjectList}
        handleChange={handleChange}
        noScanner
      />
      <ScrollView>
        <ListUI
          List={projectList}
          selectProperty={"label"}
          onPress={onPress}
        />
      </ScrollView>
      </Layout>
    </>
  );
};

export default ProjectSelector;
