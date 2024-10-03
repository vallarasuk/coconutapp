import React from "react";
import {  View } from "react-native";
import { TouchableOpacity } from "react-native";
import style from "../../../helper/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import Label from "../../../components/Label";
import AlternativeColor from "../../../components/AlternativeBackground";

const ListCard = (props) => {
  const { name, onPress, id,index } = props;
  const containerStyle = AlternativeColor.getBackgroundColor(index);

  return (

    <TouchableOpacity style={[style.listContainer, containerStyle]} key={id} onPress={onPress}>
     <Label text={name} size={16} />
     
             <View style={style.alingCount}>

             <MaterialIcons name="chevron-right" size={35} color="gray" />
         </View>      
  </TouchableOpacity>
   
  );
};



export default ListCard;
