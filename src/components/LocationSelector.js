// Import React and Component
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
  View,
  Text,
} from "react-native";
import Spinner from "./Spinner";

import StoreService from "../services/StoreService";

import { useIsFocused } from "@react-navigation/native";

import SearchBar from "./SearchBar";

import Fuse from "fuse.js";

import ArrayList from "../lib/ArrayList";

import ListUI from "./ListUI";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../helper/Color";

const StoreList = (props) => {
  const { locationByRole } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState(false);
  const [location, setLocation] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    getLocationList(true);
  }, [isFocused]);

  const getLocationList = async (initalLoad) => {
    if (initalLoad) {
      setIsLoading(true);
    }
    setSearchPhrase("")
    setClicked(false)
    await StoreService.list({}, (error, response) => {
      let locationList = response?.data?.data;

      setLocationList(locationList);

      if (initalLoad) {
        setIsLoading(false);
      }
    });
  };

  const handleChange = async (search) => {
    if (search) {
      let storeListData = new Array();

      const fuseOptions = {
        keys: ["name", "IpAddress"], // Properties to search in each object
      };

      const fuse = new Fuse(locationList, fuseOptions);
      const searchStore = new Fuse(location, fuseOptions);

      let results = locationByRole
        ? searchStore.search(search)
        : fuse.search(search);

      if (ArrayList.isNotEmpty(results)) {
        for (let i = 0; i < results.length; i++) {
          storeListData.push({
            id: results[i].item.id,
            IpAddress: results[i].item.IpAddress,
            name: results[i].item.name,
          });
        }
      }
      setLocation(storeListData);
      setLocationList(storeListData);
    } else {
      getLocationList(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        setClicked={setClicked}
        clicked={clicked}
        onPress={getLocationList}
        handleChange={handleChange}
        noScanner
      />
      <ScrollView>
        {locationList && locationList?.length > 0 ? (
          <ListUI
            List={locationList}
            selectProperty={"name"}
            onPress={props.onPress}
            showSelectedRow={props?.showSelectedRow}
            selectedRowProperty={props?.selectedRowProperty}
            rowCompareValue={props?.rowCompareValue}
          />
        ) : (
          <View style={{ paddingVertical: 250, alignItems: "center" }}>
            <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
            <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default StoreList;
