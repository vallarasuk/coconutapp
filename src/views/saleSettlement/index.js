// Import React and Component
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../../helper/Color";
import SaleSettlementCard from "./components/SaleSettlementCard";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import SaleSettlementService from "../../services/SaleSettlementService";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import DateFilter from "../../components/DateFilter";
import DateTime from "../../lib/DateTime";
import saleSettlementService from "../../services/SaleSettlementService";
import { useForm } from "react-hook-form";
import { Filter } from "../../helper/Filter";
import styles from "../../helper/Styles";


const Sale = (props) => {
  let params = props?.route?.params

  const [salesList, setSalesList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
  const [page, setPage] = useState(2);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);
  const isFocused = useIsFocused();
  const [permission, setPermission] = useState("")
  const [values, setValues] = useState({        
    selectedDate: Filter.TODAY_VALUE
});
  const navigation = useNavigation();
  const addPermission = async () => {
    const addPermission = await PermissionService.hasPermission(Permission.SALE_SETTLEMENT_ADD);
    setPermission(addPermission);
  }

  // render the stock entry list function
  useEffect(() => {
    if (isFocused) {
      let mount = true;
      mount && addPermission()
        getSalesSettlementList(values);
      //cleanup function
      return () => {
        mount = false;
      };
    }
    
  }, [isFocused, refreshing]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
  });
 
  const getSalesSettlementList = async (values) => {
    setIsLoading(true);

    try {

      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");
      let params = { page: 1, sort: "id", sortDir: "DESC" };
      if(values?.selectedDate){
        params.selectedDate = values.selectedDate
  
     }
      SaleSettlementService.search(params, (error, response) => {
        let sales = response?.data?.data;

        // Set response in state
        setSalesList(sales);
        setIsLoading(false);


      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const handleDateFilterChange = (value) => {
    setValues({
      selectedDate: value
  })
     getSalesSettlementList({selectedDate: value})
  }
  const AddNew = async () => {
      await saleSettlementService.ValidateSalesSettlementOnAdd((err,response)=>{
      if(response && response.status == 200){
        navigation.navigate("SalesSettlementForm");

      }
      })
  };


  const LoadMoreList = async () => {
    try {
      let params
      setIsFetching(true);
      
       params = { page: page, sort: "id", sortDir: "DESC" };
      if(values?.selectedDate){
        params.selectedDate = values.selectedDate
  
     }


      SaleSettlementService.search(params, (error, response) => {

        let sales = response?.data?.data;

        // Set response in state
        setSalesList((prevTitles) => {
          return [...new Set([...prevTitles, ...sales])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(sales.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title={"Sales Settlement"}
      addButton={permission ? true : false}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      showBackIcon={false}
      refreshing={refreshing}
      
      filter={
        <DateFilter
          handleDateFilterChange={handleDateFilterChange}
          control={control}
          data={values?.selectedDate}
          showCloseIcon={false}    
        />}

    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

        <View style={styles.container}>
          <View>
            {salesList && salesList.length > 0 ? (
              salesList.map((item, index) => {
                const containerStyle = AlternativeColor.getBackgroundColor(index)

                return (
                  <SaleSettlementCard
                    saleSettlementNumber={item.saleSettlementNumber}
                    date={item.date}
                    locationName={item.locationName}
                    salesExecutive={item.salesExecutive}
                    status={item.status}
                    total_amount={item.total_amount}
                    shift={item.shift}
                    alternative={containerStyle}
                    onPress={() => {
                      navigation.navigate("SalesSettlement/Detail", { item });
                    }}
                  />
                );
              })
            ) : (
              <View style={{ paddingVertical: 250, alignItems: "center" }}>
                <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
                <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
              </View>
            )}
            <ShowMore List={salesList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
          </View>
        </View>
      </Refresh>
    </Layout>
  );
};

export default Sale;

