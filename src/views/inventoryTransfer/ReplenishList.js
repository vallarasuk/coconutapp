import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ProductCard from "../../components/ProductCard";
import { Color } from "../../helper/Color";
import { Divider } from "react-native-paper";

const ReplenishList = ({ data }) => {
  const renderItem = ({ item }) => (
    <View>
      <View style={styles.container}>
        <ProductCard
          size={item.size}
          unit={item.unit}
          name={item?.product_name}
          image={item.image}
          brand={item.brand}
          sale_price={item.sale_price}
          mrp={item.mrp}
          pack_size={item.packSize}
          noIcon
          item={item}
        />
      </View>
      <Divider />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingVertical: 8,
    alignItems: "flex-end"
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: Color.LIGHT_GRAY,
    justifyContent: "space-between",
    paddingTop: 5,
    alignItems: "flex-end"
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%"
  },
  headerCell: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    borderLeftWidth: 0.5,
    borderColor: "lightgray",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 0.5,
    borderTopColor: "lightgray",
    paddingVertical: 2,
    alignItems: "flex-end",
    borderBottomColor: "lightgray"
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    borderLeftWidth: 0.5,
    borderColor: "lightgray",
    borderBottomWidth: 1,
    borderRightWidth: 0.5,
    alignItems: "flex-end",
    borderBottomColor: "lightgray",
    padding: 5
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10
  },
  circleContainer3: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Color.BLACK,
    marginRight: 25,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  circleText: {
    color: Color.WHITE,
    fontSize: 12,
    alignItems: "center",
    marginBottom: 2
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});

export default ReplenishList;
