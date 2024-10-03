import React from "react";
import { View, Text } from "react-native";
import Currency from "../lib/Currency";
import Number from "../lib/Number";
import styles from "../helper/Styles";

const TotalCard = ({ value, label }) => {

  if (!Number.GetFloat(value)) {
    return null;
  }

  return (
    <View style={[styles.FooterAmountCardContainer, { flexDirection: "row" }]}>
      <View style={[{ paddingTop: 10, paddingBottom: 10 }]}>
        <Text style={styles.footerText}>
          {label}:&nbsp;
          <Text style={styles.amountText}>
            {Currency.IndianFormat(value)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default TotalCard;
