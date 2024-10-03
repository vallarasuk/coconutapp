import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { Color } from "../helper/Color";
import styles from "../helper/Styles";
import Currency from "../lib/Currency";
import { getFullName } from "../lib/Format";
import Status from "./Status";

const SalaryCard = (props) => {
  const {
    image,
    size,
    firstName,
    lastName,
    month,
    style,
    onPress,
    avatarStyle,
    text,
    name,
    onLongPress,
    amount,
    year,
    status,
    statusColor,
  } = props;

  let fullName = getFullName(firstName, lastName);

  const show = props.showFullName !== undefined ? props.showFullName : true;

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.leadContainer}>
        <View style={styles.cardUser}>
          <View style={[styles.direction, styles.cardAlign]}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={avatarStyle ? avatarStyle : styles.source}
              />
            ) : (
              <UserAvatar
                size={size ? size : 20}
                name={fullName}
                bgColor={Color.PRIMARY}
              />
            )}
            <View style={styles.infoContainers}>
              {show && (
                <Text
                  style={
                    text
                      ? styles.textName
                      : name
                      ? styles.userName
                      : styles.nameText
                  }
                >
                  {fullName}
                </Text>
              )}
              <Text>{`${month} ${year}`}</Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.infoText}>{Currency.IndianFormat(amount)}</Text>
            <Status status={status} backgroundColor={statusColor} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SalaryCard;
