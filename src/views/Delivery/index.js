import React, { useEffect, useState } from "react";
import OrderList from "../../components/OrderList";
import Order from "../../helper/Order";
import AsyncStorage from "../../lib/AsyncStorage";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Alert from "../../lib/Alert";
import orderService from "../../services/OrderService";

const Delivery = (props) => {
  const [locationName, setlocationName] = useState();
  const [userName, setUserName] = useState();
  const [locationId, setLocationId] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    saveStore();
  }, []);

  const onPress = (item) => {
    navigation.navigate("Order/ProductList", { owner: item?.owner, customerId: item.customer_account, id: item.id, totalAmount: item?.total_amount, cashAmount: item?.cash_amount, upiAmount: item?.upi_amount, storeId: item.store_id, locationName: item?.locationName, shift: item?.shift, shiftId: item?.shiftDetail?.id,owner: item?.owner, date: item?.date, status: item.status, status_id: item?.statusDetail?.id, allow_edit: item?.statusDetail?.allow_edit, orderNumber: item.order_number, type: Order.DELIVERY,customerName : item?.customerName, payment_type : item?.paymentType , group: item?.statusDetail?.group,})
  }


  const onSelectCustomer = (value) => {
    let body={type: Order.DELIVERY,customer_account:value?.id}
    orderService.createOrder(body, (error, response) => {
     
      if (response && response.data && response.data.orderId) {
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{name: "Order/ProductList",params :
        {
          customerId: value?.id,
          storeId: locationId,
          locationName: locationName,
          isNewOrder: true,
          type: Order.DELIVERY,
          orderDetail: response.data.orderDetail,
          orderId: response.data.orderId,
        } }],
      })
    )
  }
})

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

  return (
    <OrderList
      title={'Delivery'}
      type={Order.DELIVERY}
      showFilter={true}
      AddNew={ () =>  props.navigation.navigate("CustomerSelector", {
        onSelectCustomer: onSelectCustomer
      })}
      onPress={onPress}
    />
  )

}
export default Delivery