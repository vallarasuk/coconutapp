import React, { useState } from "react";
import { View } from "react-native";
import Layout from "../../components/Layout";
import Refresh from "../../components/Refresh";
import ReportCard from "./components/ReportCard";

const Reports = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout
      title="Order Reports"
      isLoading={isLoading}
      refreshing={refreshing}
      showBackIcon={true}>
        <View style={{ flex: 1 }}>
          <ReportCard/>
        </View>
    </Layout>
  );
};

export default Reports;
