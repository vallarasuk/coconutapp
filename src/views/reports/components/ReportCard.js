import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AlternativeColor from "../../../components/AlternativeBackground";
import OrderReportService from "../../../services/OrderReportService";
import DateText from "../../../components/DateText";
import UserCard from "../../../components/UserCard";
import styles from "../../../helper/Styles";
import ShowMore from "../../../components/ShowMore";
import StoreText from "../../../components/StoreText";
import Currency from "../../../lib/Currency";
import NoRecordFound from "../../../components/NoRecordFound";
import Spinner from "../../../components/Spinner";
import Refresh from "../../../components/Refresh";

const ReportCard = (props) => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(2);
  const [HasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getOrderReport();
  }, []);

  const getOrderReport = async () => {

    setIsLoading(true);

    await OrderReportService.search({}, (response) => {
      let data = response?.data?.data;
      setData(data);
      setIsLoading(false);
    });
  };

  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = { page: page}
    
      
      OrderReportService.search(params, (response) => {

        let data = response && response?.data && response?.data?.data

        setData((prevTitles) => {
          return [...new Set([...prevTitles, ...data])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(data?.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  if(isLoading){
    return <Spinner/>
  }

  return (
    <View>
       <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
      {data &&
        data.length > 0 ?
        data.map((data, index) => (
          <View
            key={index}
            style={[styles.leadContainer,AlternativeColor.getBackgroundColor(index)]}>
            <View>
            <DateText date={data.date}/>
            <StoreText locationName = {data.location}/>
            {data.firstName &&
            <UserCard firstName={data.firstName}  lastName = {data.lastName} size={20} image ={data.image_url}/>
          }
            </View>
            {data.total_amount && (

            <View style={styles?.alingCount}>
            <Text style={styles.quantity_order_product}>{Currency.getFormatted(Currency.GetWithNoDecimal(data.total_amount))} </Text>
            </View>
                        )}
                        

          </View>
        )) : <NoRecordFound iconName="receipt" />
      }
      <ShowMore List={data} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
      </Refresh>
    </View>
    
  );
};

export default ReportCard;
