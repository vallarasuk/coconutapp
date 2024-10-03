import React, { useState, useEffect } from "react";
import storeService from "../services/StoreService";
import Select from './Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";




const LocationSelect = (props) => {
  const { name, data, label, onChange, disable, divider, showBorder,required, control: controlProp } = props
  const [locationList, setLocationList] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();


  useEffect(() => {
    getStoreList();

  }, [isFocused]);

  const {
    control,
    formState: { errors },
  } = useForm({
  });

  const getStoreList = () => {
    storeService.list({},(error, response) => {
      const storeListOption = new Array();
      let storeList = response?.data?.data;
      if (storeList && storeList.length > 0) {
        for (let i = 0; i < storeList.length; i++) {
          storeListOption.push({
            label: storeList[i].name,
            value: storeList[i].id,
          });
        }

        setLocationList(storeListOption);
      }

    });
  }

  return (
    <Select
      control={controlProp ? controlProp : control}
      options={locationList}
      OnSelect={onChange}
      label={label}
      name={name}
      divider={divider}
      showBorder={showBorder}
      placeholder={"Select Location"}
      data={data}
      disable={disable}
      required={required}
    />
  )
};
export default LocationSelect;
