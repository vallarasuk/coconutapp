import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Color } from "../helper/Color";
const Link = ({ onPress, title , size, color,paddingRight}) => {
  return (
    <TouchableOpacity onPress={onPress} >
      <Text style={[styles.title,{fontSize:size ? size : 13, color: color ? color : Color.GREY,paddingRight: paddingRight ? paddingRight :15,
}]}>
        {title}
      </Text>
    </TouchableOpacity>
  )

}
const styles = StyleSheet.create({
  title: {
   
    fontWeight: 'bold',
    paddingTop: 10,
    textDecorationLine: 'underline'
  }
})
export default Link;

