// Import React and Component
import React, { useEffect } from "react";
import {
    StyleSheet,
    ScrollView
} from "react-native";

import ContextMenu from "../../components/ContextMenu";

import { useNavigation } from "@react-navigation/native";

import Layout from "../../components/Layout";

import requestHardwarePermission from "../../lib/Permission";
import { PermissionsAndroid } from "react-native";
import { BackHandler } from "react-native";

const Setting = () => {

    const navigation = useNavigation();

    useEffect(() => {
      async () => {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted == false) {
          requestHardwarePermission();
        }
      };
    }, []);
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            navigation.navigate("Menu", { navigator: navigation });
            return true;
          }
        );
    
        return () => backHandler.remove();
      }, [navigation]);

    
    const bluetoothClickHandler = () => {
        navigation.navigate("Bluetooth/Setting");
    }

    const storeClickHandler = () => {
        navigation.navigate("Settings/SelectStore",{isLocationChange:true});
    }

    const SettingMenu = [{ name: "Bluetooth" , onPress: bluetoothClickHandler}, { name: "Store" , onPress: storeClickHandler}]

    return (
        <Layout title={"Settings"}  showBackIcon={true} backButtonNavigationUrl =  {"Menu"} params = {{navigator: navigation}}
        >
            <ScrollView>
                <ContextMenu ItemList={SettingMenu} />
            </ScrollView>
        </Layout>
    );
};

export default Setting;

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
