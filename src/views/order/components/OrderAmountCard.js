import { StyleSheet, View, Text } from "react-native";
import CurrencyFormat from "../../../lib/Currency";
import Numbers from "../../../lib/Number";
import { Color } from "../../../helper/Color";
import style from "../../../helper/Styles";

const OrderAmountCard = (props) => {
  const { totalCash, totalUpi, totalDraftAmount, totalAmount,padding } = props;

  return (
    <View style={[style.FooterAmountCardContainer,{paddingVertical : padding}]}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.amountContainer}>
            <Text style={style.footerText}>
              Cash:&nbsp;&nbsp;
              <Text style={style.amountText}>
                {CurrencyFormat.getFormatted(Numbers.Get(totalCash), true)}
              </Text>
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={style.footerText}>
              PayTM:&nbsp;&nbsp;
              <Text style={style.amountText}>
                {CurrencyFormat.getFormatted(Numbers.Get(totalUpi), true)}
              </Text>
            </Text>
          </View>
        </View>
        {totalDraftAmount && (
          <View style={styles.row}>
            <Text style={style.footerText}>
              Draft:&nbsp;&nbsp;
              <Text style={style.amountText}>
                {CurrencyFormat.getFormatted(Numbers.Get(totalDraftAmount), true)}
              </Text>
            </Text>
          </View>
        )}
        {totalAmount && (
          <View style={styles.row}>
            <Text style={style.footerText}>
              Total Amount:&nbsp;&nbsp;
              <Text style={style.amountText}>
                {CurrencyFormat.getFormatted(Numbers.Get(totalAmount), true)}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderAmountCard;

const styles = StyleSheet.create({
 
  card: {
    backgroundColor: Color.BLACK,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center", 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5, 
  },
  amountContainer: {
    flex: 1,
    alignItems: "center",
  },
 
});
