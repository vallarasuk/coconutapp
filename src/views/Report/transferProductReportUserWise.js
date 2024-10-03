import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import TransferService from "../../services/TransferService";
import { View } from "react-native";
import UserCard from "../../components/UserCard";
import DateTime from "../../lib/DateTime";
import AlternativeColor from "../../components/AlternativeBackground";
import DateText from "../../components/DateText";
import styles from "../../helper/Styles";
import Label from "../../components/Label";
import FilterDrawer from "../../components/Filter";
import userService from "../../services/UserService";
import { useIsFocused } from "@react-navigation/native";
import Refresh from "../../components/Refresh";
import NoRecordFound from "../../components/NoRecordFound";
import ShowMore from "../../components/ShowMore";
import { Text } from "react-native";
import FilterCard from "../../components/FilterCard";


const TransferProductReportUserWise = () => {

  const [replenish, setReplenish] = useState([])
  const [values, setValues] = useState({ date: new Date() })
  const [openFilter, setOpenFilter] = useState(false);
  const [dateSelected, setSelectedDate] = useState(new Date());
  const [userList, setUserList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [HasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [totalProductCount, setTotalProductCount] = useState();
  useEffect(() => {
    if(refreshing){
      getTransferProductReport(values);
    }

  }, [refreshing]);

  useEffect(() => {
    getUserList();
    getTransferProductReport(values);

  }, [])
  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      date: DateTime.formatDate(new Date()),
    }));
  }, []);

  const getTransferProductReport = async (values) => {
    let params = {}
    if (values?.date) {
      params.date = values.date
    }
    if (values?.user) {
      params.user = values?.user
    }
    setIsLoading(true);

    await TransferService.getTransferProductReportByUserWise(params, (err, response) => {
      let data = response && response?.data && response?.data?.data;
      let Count = response && response?.data && response?.data?.totalProductCount;
      setTotalProductCount(Count)
      setReplenish(data)
      setIsLoading(false);
      setRefreshing(false)

    })
  }
  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = { page: page }
      if (values.date) {
        params.date = values?.date
      }
      if (values.user) {
        params.user = values?.user
      }
      TransferService.getTransferProductReportByUserWise(params, (err, response) => {

        let replenish = response && response?.data && response?.data?.data;

        setReplenish((prevTitles) => {
          return [...new Set([...prevTitles, ...replenish])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(replenish.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const closeDrawer = () => {
    setOpenFilter(!openFilter);
  };
  const handleSubmit = async () => {
    getTransferProductReport(values);
    closeDrawer();
  };
  const handleDeleteFilter = async(value) =>{
    if(value?.date === ""){
      setValues((prevValues) => ({
        ...prevValues,
        date: ""
      }));
      setSelectedDate("");
    }
    if(value?.userName === ""){
      setValues((prevValues) => ({
        ...prevValues,
        user: "",
        userName : "",
      }));
    }
    let params = {
      ...values,
      
    }
    if(value?.userName === ""){
        params.user = ""
    }
    if(value?.date === ""){
       params.date = ""
    }
    getTransferProductReport(params);
  }
  const getUserList = () => {
    userService.list(null, (callback) => { setUserList(callback) });

  }
  const userOnSelect = (value) => {
    if (value) {
      setValues((prevValues) => ({
        ...prevValues,
        user: value?.value,
        userName :{ name : value?.label, image : value?.image}
       
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        user: "",
        userName : "",
      }));
    }

  }
  const onDateSelect = (value) => {
    if (value) {
      setValues((prevValues) => ({
        ...prevValues,
        date: DateTime.formatDate(new Date(value)) 
      }));
      setSelectedDate(new Date(value));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        date: ""
      }));
      setSelectedDate("");
    }
  }

  return (
    <Layout
      title={"Transfer Product Report(User Wise)"}
      showBackIcon
      showFilter
      onFilterPress={closeDrawer}
      isLoading={isLoading}
      refreshing={refreshing}
      filteredValue ={<>
       
      <FilterCard  data={[values]} handleDeleteFilter={(value)=> {handleDeleteFilter(value)}} />

        </>
    }
      FooterContent={<View style={styles.align}>
        <Text
          style={styles.letter}
        >
          Total Product Count :
          <Text style={[styles.letterColor]}>
            {totalProductCount}
          </Text></Text>
      </View>}


    >
      <FilterDrawer
        values={values}
        isOpen={openFilter}
        closeDrawer={closeDrawer}
        userOnSelect={userOnSelect}
        onDateSelect={onDateSelect}
        selectedDate={dateSelected}
        handleSubmit={handleSubmit}
        userList={userList}
        showOnDate
        showUser
        clearFilter={() => {
          setValues("");
          getTransferProductReport();
          closeDrawer();
        }}
      />
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

        <View>
          {replenish && replenish.length > 0 ? replenish.map((item, index) => {
            const containerStyle = AlternativeColor.getBackgroundColor(index, { plainText: true })

            return (
              <View style={[containerStyle, styles.accounts]}>
              <View style={styles.direction}>
                <View style={styles.halfWidth}>
                  <UserCard
                    firstName={item.first_name}
                    lastName={item.last_name}
                    image={item.media_url}
                  />
                </View>
            
                <View style={styles?.alingCount}>
                  <Text style={{ fontWeight: "600" }}>
                    {item.product_count} ({item.count})
                  </Text>
                </View>
              </View>
              <DateText
                date={item.date ? item.date : DateTime.formatDate(new Date())}
                style={styles.alignType}
              />
            </View>
            


            )
          }) : <NoRecordFound iconName={"receipt"} />}
          <ShowMore List={replenish} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

        </View>
      </Refresh>

    </Layout>


  )

}
export default TransferProductReportUserWise;