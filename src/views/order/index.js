import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import OrderList from "../../components/OrderList";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import Order from "../../helper/Order";
import AsyncStorage from "../../lib/AsyncStorage";
import dateTime from "../../lib/DateTime";
import shiftService from "../../services/ShiftService";
import CustomerInfoModal from "./CustomerInfoModal";
import { useForm } from "react-hook-form";
import settingService from "../../services/SettingService";
import Setting from "../../lib/Setting";
import Boolean from "../../lib/Boolean";
import AlertMessage from "../../lib/Alert";
import orderService from "../../services/OrderService";
import OrderTypeService from "../../services/orderTypeService";
import OnePortalDB from "../../lib/SQLLiteDB";
import ArrayList from "../../lib/ArrayList";
let DB = OnePortalDB.open('oneportal.db');

const Products = (props) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedShift, setSelectedShft] = useState("");
  const [locationName, setlocationName] = useState();
  const [userName, setUserName] = useState();
  const [shiftName, setShiftName] = useState();
  const[collectCustomerInfo,setCollectCustomerInfo] = useState("")

  const [locationId, setLocationId] = useState();
  const [orderTypes, setOrderTypes] = useState([]);
  console.log("orderTypes------------------------", orderTypes)


  const navigation = useNavigation();
  useEffect(() => {
    saveStore();
    getRequiredValues();
    getCustomerNumber();
    getOrderTypes()
  }, []);
  
  const getOrderTypes=async ()=>{
    let orderData = await OnePortalDB.runQuery(DB, `SELECT * FROM "order_type" `);

    console.log("orderData------------------------", orderData)

    if (orderData && ArrayList.isNotEmpty(orderData)) {
      setOrderTypes(orderData[0])

  }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
} = useForm({
});

  const getRequiredValues = async () => {
    shiftService.getShiftList(null, (error, response) => {
      let shiftList = response?.data?.data;
      if (shiftList && shiftList.length > 0) {
        for (let i = 0; i < shiftList.length; i++) {
          let timeValidation = dateTime.compareTime(
            shiftList[i].start_time,
            shiftList[i].end_time
          );

          if (timeValidation) {
            setSelectedShft(shiftList[i].id);
            setShiftName(shiftList[i].name);
          }
        }
      }
    });

    let userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);

    setSelectedUser(userId);
  };

  const saveStore = async () => {
    try {
      await AsyncStorage.getItem(
        AsyncStorageConstants.SELECTED_LOCATION_ID
      ).then((res) => setLocationId(res));
      await AsyncStorage.getItem(
        AsyncStorageConstants.SELECTED_LOCATION_NAME
      ).then((res) => setlocationName(res));
      await AsyncStorage.getItem(AsyncStorageConstants.USER_NAME).then((res) =>
        setUserName(res)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getCustomerNumber = async ()=>{
    await settingService.getByName(Setting.COLLECT_CUSTOMER_INFO,(err,response)=>{
      setCollectCustomerInfo(response)
    })
  
  }




  const AddNew = () => {
    // if(Boolean.isTrue(collectCustomerInfo)){
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{  name: "Order/ProductList",params :{
    //         storeId: locationId,
    //         locationName: locationName,
    //         shift: shiftName,
    //         ownerName: userName,
    //         userId: selectedUser,
    //         shiftId: selectedShift,
    //         isNewOrder: true,
    //         collectCustomerInfo:collectCustomerInfo,
    //         type: Order.STORE} }],
    //     })
    //   )
    // }else{   
    //   orderService.createOrder({}, (error, response)=> {
    //     if( response && response.data && response.data.orderId){
    //       navigation.dispatch(
    //         CommonActions.reset({
    //           index: 0,
    //           routes: [{  name: "Order/ProductList",params :{ orderDetail: response.data.orderDetail,
    //             orderId: response.data.orderId,
    //             storeId: locationId,
    //             locationName: locationName,
    //             shift: shiftName,
    //             ownerName: userName,
    //             userId: selectedUser,
    //             shiftId: selectedShift,
    //             isNewOrder: true,
    //             collectCustomerInfo:collectCustomerInfo,
    //             type: Order.STORE} }],
    //         })
    //       )
    //     }
    //   })
    // }

  };

  const onPress = (item) => {
    navigation.navigate("Order/ProductList", { id: item.id, totalAmount: item?.total_amount, cashAmount: item?.cash_amount, upiAmount: item?.upi_amount, storeId: item.store_id, locationName: item?.locationName, shift: item?.shift, shiftId: item?.shiftDetail?.id,owner: item?.owner, date: item?.date, status: item.status, group: item?.statusDetail?.group,status_id: item?.statusDetail?.id, allow_edit: item?.statusDetail?.allow_edit, orderNumber: item.order_number, type : Order.STORE,paymentType:item?.paymentType })
  }

  return (
    <>
    <OrderList
      title={'Orders'}
      type={Order.STORE}
      AddNew={AddNew}
      onPress={onPress}
      showFilter={true}
    />

    
    </>

  );
};

export default Products;
