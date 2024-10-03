import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import UserCard from "../../../components/UserCard";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";
import StoreText from "../../../components/StoreText";
import styles from "../../../helper/Styles";
import DateTime from "../../../lib/DateTime";

const TransferCard = (props) => {

  const {
    fromLocationName,
    toLocationName,
    status,
    statusColor,
    date,
    item,
    transferNumber,
    onPress,
    type,
    id,
    alternative,
    onLongPress,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={1.2}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <View style={[styles.accounts, alternative]}>
        <View style={styles.direction}>
          <View style={{ flex: 5 }}>
            <View style={styles.direction}>
              {transferNumber && <IdText id={transferNumber} />}
              <DateText date={DateTime.formatDate(date)} />
            </View>
            <UserCard
              firstName={item.owner}
              lastName={item.lastName}
              image={item.image}
              onPress={onPress}
            />
            {type && (
              <Text>{item?.type}</Text>
            )}
            <View style={styles.direction}>
              <StoreText locationName={fromLocationName} />
              <Text>{" -> "}</Text>
              <StoreText locationName={toLocationName} />
            </View>
          </View>
          <View style={{ paddingTop: 25, paddingBottom: 25 }}>
            {status && (
              <Status status={status} backgroundColor={statusColor} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransferCard;


