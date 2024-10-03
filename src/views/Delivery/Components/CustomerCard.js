import React from "react";
import { View, Text,TouchableOpacity, StyleSheet } from "react-native";
import DateTime from "../../../lib/DateTime";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";
import CurrencyText from "../../../components/CurrencyText";
import AlternativeColor from "../../../components/AlternativeBackground";
import StoreText from "../../../components/StoreText";
import UserCard from "../../../components/UserCard"
import Label from "../../../components/Label";
import styles from "../../../helper/Styles";

const CustomerCard = (props) => {
  const { order_number,customerName, status,firstName,lastName,mediaUrl,statusColor, total_amount,payment_type, date, onPress, index,text } = props;



  const containerStyle = AlternativeColor.getBackgroundColor(index)
  return (
    <TouchableOpacity style={[styles.listContainer, containerStyle]} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text>
        <IdText id={order_number} />
        <DateText date={DateTime.formatedDate(date)}/>
        </Text>
     
       
        {customerName && (
          <View style ={styles.direction}>
            <Label text = {customerName} size = {14} bold = {true} />
            <Text>, {payment_type}</Text>
             <CurrencyText amount={total_amount} />
            </View>
        )}
      
        {firstName  && (
        <UserCard firstName={firstName} lastName={lastName} image ={mediaUrl}/>

        )}

        </View>
        <Status
          status={status} backgroundColor={statusColor}
        />
    </TouchableOpacity>
  );
};

export default CustomerCard;

