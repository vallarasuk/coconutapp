import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import style from "../../../helper/Styles";
import UserCard from "../../../components/UserCard";
import { MaterialIcons } from "@expo/vector-icons";

const AccountCard = (props) => {
  const { accountName, onPress, alternative, mobileNumber,showIcon, id,isOnpress } = props;
  return (
    <TouchableOpacity style={[style.leadContainer, alternative]} key={id} onPress={onPress} disabled = {isOnpress ? isOnpress : false}>
    <UserCard firstName={accountName} onPress={onPress} size={55} phoneNumber={mobileNumber} />
      {showIcon && (
             <View style={style.alingCount}>

             <MaterialIcons name="chevron-right" size={35} color="gray" />
         </View>      
          )}
  </TouchableOpacity>
   
  );
};



export default AccountCard;
