import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import UserCard from "../../components/UserCard";
import DateTime from "../../lib/DateTime";


const MessageCard = (props) => {
  const { firstName,lastName,message,media,time, alternative, onPress } = props;

  return (
    <TouchableOpacity style={[ alternative]} onPress={onPress}>
     <View style={styles.row}>
     <View >
     <UserCard firstName={firstName} lastName={lastName} image ={media}/>
     <Text style={styles.time}>
           {DateTime.formatedDate(time)}
        </Text>
            
     <Text numberOfLines={2} style={styles.summary}>{message} </Text>
           
      </View>
      </View>

    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({

time :{
    fontSize: 10, 
    marginTop: -18,
     marginLeft:230
},
  row: {
    marginTop: 6,
    marginBottom: 6,
  },
 
  summary: {
    paddingLeft: 35,
    paddingBottom: 5,
    maxWidth: "99%"
  },

  
 
});
