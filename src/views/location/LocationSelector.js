// Import React and Component
import React from "react";

import Layout from "../../components/Layout";

import LocationSelector from "../../components/LocationSelector";

const LocationSelectionScreen = (props) => {

  let params = props?.route?.params;


  const onSelectStore = (selectedStoreId) => {
    params && params.onSelectStore(selectedStoreId , params.params);
  }

  return (

    <Layout
      title="Select Location"
      showBackIcon
    >
      <LocationSelector onPress={onSelectStore} locationByRole={params?.locationByRole}/>
    </Layout>
  );
};

export default LocationSelectionScreen;
