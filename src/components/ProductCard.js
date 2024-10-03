// Import React and Component
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button
} from "react-native";

// icons
import { MaterialIcons } from "@expo/vector-icons";
import Currency from "../lib/Currency";
import ImageCard from "./ImageCard";

import { Color } from "../helper/Color";
import Order from "../helper/Order";
import StatusService from "../services/StatusServices";
import DateTime from "../lib/DateTime";
import Status from "../helper/Status";
import IdText from "./IdText";
import style from "../helper/Styles";
import StoreText from "./StoreText";
import CurrencyText from "./CurrencyText";


const ProductCard = (props) => {
  const {
    onPress,
    name,
    image,
    brand,
    sale_price,
    mrp,
    size,
    unit,
    quantity,
    item,
    search,
    QuantityField,
    noIcon,
    disabled,
    status,
    statusUpdate,
    alternative,
    pack_size,
    date,
    orderDate,
    orderProduct,
    orderNumber,
    locationName,
    amountField,
    amount,
    ownerName,
    onLongPress
  } = props;

  const [productStatus, setProductStatus] = useState([])

  useEffect(() => {
    if (item?.currentStatusId) {
      getNextStatus();
    }
  }, [statusUpdate])

  const getNextStatus = async () => {
    let nextStatusList = await StatusService.getNextStatus(item.currentStatusId, null);
    if (nextStatusList) {
      setProductStatus(nextStatusList);
    }
  }
  return (
    <TouchableOpacity
      style={[
        alternative ? alternative : style.ProductCard,
        !noIcon && { elevation: 5 },
        QuantityField && search ? { paddingHorizontal: 20 } : "",
      ]}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={QuantityField ? 1 : 0.4}
      onPress={() => onPress && onPress(item)}
    >
      <View style={style.imageCardAlign}>
        <ImageCard ImageUrl={image} />
      </View>
      <View
        style={[
          style.productContainer,
          QuantityField ? { flex: 0.65 } : { flex: 0.85 },
        ]}
      >
        <View style={style.direction}>

          {orderNumber && (
            <IdText id={orderNumber} />

          )}
          {orderDate && (
            <Text>{(orderDate)}</Text>
          )}
        </View>
        {locationName && (
          <StoreText locationName={locationName} />
        )}
        {brand ? <Text style={{ fontWeight: "700" }}>{brand}</Text> : ""}
        <View style={style.direction}>
          <Text style={[style.productCardText]}>
            {name}
            {size ? ", " + size : ""}
            {unit}
            {pack_size
              ? `(Pack Size: ${pack_size
                ? pack_size
                : " "
              })`
              : ""}
          </Text>
        </View>
        <View style={style.direction}>
          {sale_price ? (
            mrp != sale_price && mrp > 0 ? (
              <View style={style.direction}>
                <Text style={style.lineAlign}>
                  {Currency.IndianFormat(mrp)}
                </Text>
                {mrp > 0 && mrp != sale_price ? (
                  <Text style={style.amountAlign}>
                    {Currency.IndianFormat(sale_price)}
                  </Text>
                ) : (
                  ""
                )}
              </View>
            ) : (
              <Text>{Currency.IndianFormat(sale_price)}</Text>
            )
          ) : (
            <Text>{Currency.IndianFormat(mrp)}</Text>
          )}


          {status && (
            <Text style={{ color: status === Order.STATUS_CANCEL || status === Status.ARCHIVED ||status === Status.INACTIVE_TEXT ? Color.RED : Color.SECONDARY }}>
              {` (${status})`}
            </Text>
          )}
        </View>

        {ownerName && (
          <Text>{ownerName}</Text>
        )}

        {date && (
          <Text>{DateTime.formatedDate(date)}</Text>
        )}

        {productStatus && productStatus.length > 0 && statusUpdate && (
          <View style={style.buttonContainer}>
            {productStatus.map((status, index) => {
              return (
                <View key={status.id} style={{ width: productStatus.length == 1 ? '100%' : productStatus.length == 2 ? '50%' : '50%', marginRight: index !== productStatus.length - 1 ? 1 : 0 }}>
                  <Button
                    title={status.name}
                    color={status.color_code}
                    onPress={() => statusUpdate && statusUpdate(status.status_id, item.inventoryTransferProductId)}
                  />
                </View>
              );
            })}
          </View>
        )}


      </View>
      {!amount && QuantityField ? (
        <>
          <View style={style.quantityAlign}>
            <Text style={orderProduct ? style.quantity_order_product : style.quantity}>
              {quantity}
            </Text>
          </View>

        </>
      ) : (
        !noIcon && <MaterialIcons name="chevron-right" size={30} color="gray" />
      )}
      {amountField && QuantityField && amount && (
        <>
         <View style={style.quantityAlign}>
         <Text style={style.quantity_order_product}>{Currency.getFormatted(Currency.GetWithNoDecimal(amount))} </Text>

            <Text style={style.quantity}>
              ({quantity})
            </Text>
          </View>

        </>
      ) }



    </TouchableOpacity>
  );
};

export default ProductCard;


