import Layout from "../../components/Layout";
import React, { useEffect, useState } from "react";
import DateTime from "../../lib/DateTime";
import OrderProduct from "../../helper/OrderProduct";
import OrderReportChart from "./OrderReportChart";
import { View, ScrollView, RefreshControl } from "react-native";
import FilterDrawer from "../../components/Filter";
import shiftService from "../../services/ShiftService";
import storeService from "../../services/StoreService";
import OrderSummaryReportService from "../../services/OrderSummaryReportService";

const OrderSummaryReport = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedValues, setSelectedValues] = useState({
    type: OrderProduct.REPORT_TYPE_LOCATION_WISE,
    startDate:new Date(),
    endDate:new Date()
  });

  const [filterData, setFilterData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [shiftList, setShiftList] = useState();
  const [locationList, setLocationList] = useState();


  useEffect(() => {
    getOrderReport(selectedValues);
    getStoreList();
    getShiftList();
  }, []);
  useEffect(()=>{
    if(refreshing){
      getOrderReport(selectedValues);
    }

  },[refreshing])

  const closeDrawer = () => {
    setOpenFilter(!openFilter);
  };

  const typeOptions = [
    {
      label: OrderProduct.REPORT_TYPE_LOCATION_WISE,
      value: OrderProduct.REPORT_TYPE_LOCATION_WISE
    },
    {
      label: OrderProduct.REPORT_TYPE_DATE_WISE,
      value: OrderProduct.REPORT_TYPE_DATE_WISE
    },
    {
      label: OrderProduct.REPORT_TYPE_MONTH_WISE,
      value: OrderProduct.REPORT_TYPE_MONTH_WISE
    }
  ];
  const getStoreList = ()=>{
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

  const getShiftList = () =>{
        let shiftListOption = new Array();

        shiftService.getShiftList({ showAllowedShift: true }, (error, response) => {
            let shiftList = response?.data?.data;
            if (shiftList && shiftList.length > 0) {
                for (let i = 0; i < shiftList.length; i++) {
                    shiftListOption.push({
                        label: shiftList[i].name,
                        value: shiftList[i].id,
                    });
                }
                setShiftList(shiftListOption);
            }
        })
     }

  const shiftOnChange = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        shift: value
      }));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        shift: ""
      }));
    }
  };

  const paymentTypeSelect = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        paymentType: value
      }));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        paymentType: ""
      }));
    }
  };

  const locationOnSelect = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        location: value
      }));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        location: ""
      }));
    }
  };

  const onDateSelect = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        startDate: new Date(value)
      }));
      setSelectedDate(new Date(value));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        startDate: ""
      }));
      setSelectedDate("");
    }
  };

  const onEndDateSelect = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        endDate: new Date(value)
      }));
      setSelectedEndDate(new Date(value));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        endDate: ""
      }));
      setSelectedEndDate("");
    }
  };

  const typeOnSelect = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        type: value.value
      }));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        type: ""
      }));
    }
  };

  const sortTypeOnSelect = (value) => {
    if (value) {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        sortType: value
      }));
    } else {
      setSelectedValues((prevValues) => ({
        ...prevValues,
        sortType: ""
      }));
    }
  };
 
  const handleSubmit = () => {
      getOrderReport(selectedValues)
  };

  const getOrderReport = async (values) => {
    try {
       data && data.length == 0 && setIsLoading(true)
      let params = {};

      if (values?.location) {
        params.location = values.location;
      }

      if (values?.shift) {
        params.shift = values.shift;
      }
      if (values?.startDate) {
        params.startDate = DateTime.formatDate(values?.startDate);
      } 

      if (values?.endDate) {
        params.endDate = DateTime.formatDate(values?.endDate);
      } 
      if (values?.type) {
        params.type = values.type;
      } else {
        params.type = OrderProduct.REPORT_TYPE_LOCATION_WISE;
      }

      if (values?.paymentType) {
        params.paymentType = values.paymentType;
      }

      if (values?.sortType) {
        params.sortType = values.sortType;
      }

      await OrderSummaryReportService.list(params, (response) => {
        let data = response?.data;
        setData(data);
        setFilterData(response?.data);
        setIsLoading(false);
        setRefreshing(false);
        setOpenFilter(false)
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getOrderReport(selectedValues).then(() => {
      setRefreshing(false);
    });
  };

  return (
    <Layout
      title="Order Summary Report "
      isLoading={isLoading}
      refreshing={refreshing}
      showBackIcon={true}
      showFilter={true}
      onFilterPress={closeDrawer}
    >
      <FilterDrawer
        values={selectedValues}
        isOpen={openFilter}
        closeDrawer={closeDrawer}
        locationOnSelect={locationOnSelect}
        shiftOnSelect={shiftOnChange}
        paymentOnSelect={paymentTypeSelect}
        onDateSelect={onDateSelect}
        onEndDateSelect={onEndDateSelect}
        selectedDate={selectedDate}
        selectedEndDate={selectedEndDate}
        typeOnSelect={typeOnSelect}
        sortTypeOnSelect={sortTypeOnSelect}
        handleSubmit={handleSubmit}
        typeList={typeOptions}
        shiftList={shiftList}
        locationList={locationList}
        showDate
        showLocation
        showShift
        showType
        showTypeOption
        showPayment
      />

      <View style={{ flex: 1 }}>
      <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
      <OrderReportChart
        data={data}
        filterData={filterData}
        params={selectedValues}
      />
        </ScrollView>
      </View>
    </Layout>
  );
};

export default OrderSummaryReport;
