import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTime from "../../../lib/DateTime";
import { Color } from "../../../helper/Color";
import UserCard from "../../../components/UserCard";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";
import styles from "../../../helper/Styles";
import Status from "../../../components/Status";
import StoreText from "../../../components/StoreText"
const StockEntryCard = (props) => {
  const {
    stock_entry_number,
    store,
    date,
    firstName,
    lastName,
    status,
    onPress,
    media,
    alternative,
    statusColor,
    stockEntryManageOtherPermission
  } = props;
  
  
  return (
    <TouchableOpacity activeOpacity={1.2} style={[styles.cardContainer, alternative]} onPress={onPress}>
      <View style={styles.cardRow}>
        <View style={styles.cardUser}>
          <View style={[styles.direction, styles.cardAlign]}>
            <IdText id={stock_entry_number} />
            <DateText date={DateTime.formatDate(date)} />
          </View>
          <View style={styles.cardStatus}>
            <Status status={status} backgroundColor={statusColor} />
          </View>
        </View>

        <StoreText locationName={store} />
       {stockEntryManageOtherPermission && 
       <View style={[styles.direction,styles.circleDirection]}>
       <UserCard firstName={firstName} lastName={lastName} size={20} image={media} />
     
       </View>
       } 
          

        

        
        
      </View>
    </TouchableOpacity>
  );
};
export default StockEntryCard;
