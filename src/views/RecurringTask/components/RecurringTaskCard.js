import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import DateText from "../../../components/DateText";
import UserCard from "../../../components/UserCard";
import DateTime from "../../../lib/DateTime";
import { useNavigation } from "@react-navigation/native";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText"
import style from "../../../helper/Styles";
import status from "../../../helper/Status";
import { Color } from "../../../helper/Color";


const RecurringTaskCard = (props) => {
  const {item, alternative, onPress } = props;
  return (
    <TouchableOpacity style={[style.cardContainer, alternative]} onPress={onPress}>
      <View style={style.leadContainer}>
      <View style={style.cardUser}>
          <View style={[style.direction, style.cardAlign]}>
            <IdText id={item.item} />
            <Text>{item.project_name} </Text>
            <DateText date={DateTime.formatDate(item.createdAt)} />
          </View>
          {item.status && (

          <View style={style.cardStatus}>
            <Status status={item.status} backgroundColor={item.status === status.ACTIVE_TEXT ? Color.GREEN : Color.LIGHT_GREY}/>
          </View>
                    )}

        </View>
        <Text>{item.type}</Text>
        <View style={style.summary}>
          <Text numberOfLines={2} style={style.font}>
           {item.summary}
          </Text>
        </View>
            <UserCard firstName={item.firstName} lastName = {item.lastName} size={20} text image ={item.media_url}/>
      </View>

    </TouchableOpacity>
  );
};

export default RecurringTaskCard;

