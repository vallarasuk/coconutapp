// Import React and Component
import React from "react";


import Layout from "../../../components/Layout";

import LocationSelect from "../../../components/LocationSelector";

import { useNavigation } from "@react-navigation/native";


const AttendanceLocationSelector = (props) => {

  const navigation = useNavigation();

  const onStorePress = async (store) => {
    if (store) {
      navigation.navigate("shiftSelect", {
        store_id: store?.id,
        navigation: navigation,
        reDirectionUrl: props?.route?.params?.reDirectionUrl,
      });
    }
  };

  return (
    <Layout
      title="Select Location"
      HideSideMenu={false}
      emptyMenu={false}
      defaultFooter={true}
      showBackIcon={false}
    >
      <LocationSelect onPress={onStorePress} locationByRole={true} />
    </Layout>
  );
};

export default AttendanceLocationSelector;
