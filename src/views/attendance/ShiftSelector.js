// Import React and Component
import React, { useEffect, useState } from "react";

import Layout from "../../components/Layout";

import { BackHandler, StyleSheet } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import ShiftService from "../../services/ShiftService";

import ShiftList from "../../components/ShiftList";
import AttendanceService from "../../services/AttendanceService";
import device from "../../lib/Device";


const ShiftSelector = (props) => {
  const [shiftList, setShiftList] = useState([]);

  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);

  let params = props?.route?.params;
  useEffect(() => {
    getShiftList();
  }, [isFocused]);


  useEffect(() => {
    if (params?.forceCheckIn) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, []);

  const getShiftList = () => {
    //create new rray
    let shiftListOption = new Array();

    setIsLoading(true);

    ShiftService.getCurrentShiftList(
      { },
      (error, response) => {
        //validate shift list exist or nott
        let shiftList = response?.data?.data;

        //validate shift list
        if (shiftList && shiftList.length > 0) {
          //loop the shift list
          for (let i = 0; i < shiftList.length; i++) {
            //push the shift list
            shiftListOption.push({
              label: shiftList[i].name,
              value: shiftList[i].id,
            });
          }
          //set the shift list
          setShiftList(shiftListOption);
        }

        setIsLoading(false);
      }
    );
  };

  const onShiftSelect = async (selectedShift) => {
    if (selectedShift) {

      if (device.isSamsungDevice()) {
        params?.navigation.navigate("CameraScreen", {
          store_id: params?.store_id,
          navigation: params?.navigation,
          reDirectionUrl: params?.reDirectionUrl,
          shift_id: selectedShift?.value,
        });

      } else {
        AttendanceService.CheckIn(
          props?.route?.params?.navigation,
          props?.route?.params?.reDirectionUrl,
          setIsLoading,
          { login: true },
          { store_id: params?.store_id, shift_id: selectedShift?.value },
        );
      }
    }

  };

  return (
    <>
        <Layout
          title="Select Shift"
          showBackIcon={!params?.forceCheckIn}
          isLoading={isLoading}
        >
          <ShiftList
            shiftList={shiftList}
            onPress={onShiftSelect}
            setIsLoading={setIsLoading}
          />
        </Layout>
    </>
  );
};

export default ShiftSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  containers: {
    height: 60,
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
});
