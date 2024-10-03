import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTime from "../../../lib/DateTime";
import { Color } from "../../../helper/Color";
import UserCard from "../../../components/UserCard";
import Label from "../../../components/Label";
import Status from "../../../components/Status";
import { Fine } from "../../../helper/Fine";
import DateText from "../../../components/DateText";
import IdText from "../../../components/IdText";
import CurrencyText from "../../../components/CurrencyText";
import styles from "../../../helper/Styles";
const FineCard = (props) => {
  const {
    date, user, type, amount, id,media_url, onPress, alternative, status, statusColor, data
  } = props;
  return (
    <TouchableOpacity activeOpacity={1.2} style={[styles.listContainer, alternative]} onPress={onPress}>
      <View style={styles.infoContainer}>

      <View style={styles.direction}>
        {id && (
        <IdText id={id} />
        )}
          <DateText date={DateTime.formatDate(date)}/>

        </View>
        <View style={styles.direction}>
          <Text>
            {type}
          </Text>
          <CurrencyText amount={amount}/>
        </View>
        {data?.hasFineManageOthersPermission &&
          <UserCard firstName={user} image={media_url}/>
          }
        </View>
        {status && (
        <Status
          status={status} backgroundColor={statusColor}
        />
        )}

    </TouchableOpacity>
  );
};
export default FineCard;

