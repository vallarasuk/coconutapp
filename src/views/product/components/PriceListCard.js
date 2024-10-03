import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import Status from "../../../components/Status";
import DateText from "../../../components/DateText";
import CurrencyText from "../../../components/CurrencyText";
import styles from "../../../helper/Styles";
import Label from "../../../components/Label";
import { Color } from "../../../helper/Color";
import Active from "../../../helper/Status";
const PriceListCard = (props) => {
    const { date, status, mrp, salePrice, barCode, statusColor,type, onPress, alternative } = props

    return (
        <TouchableOpacity style={[styles.leadContainer, alternative]} onPress={onPress}>
            <View style={{ flex: 1 }}>
            <View style={[styles.direction]}>
                {date && (<DateText date={date} dateFormat/>)}
                {type && (
                    <Label text = {`  (${type})`} size={14} bold ={true}/>
                )}
                 </View>
                {mrp && (
                    <View style={styles.direction}>
                        <Label text={"MRP :"} size={14} />
                        <CurrencyText amount={mrp} mrp />

                    </View>
                )}
                {salePrice && (
                    <View style={styles.direction}>
                        <Label text={"Sale Price :"} size={14} />
                        <CurrencyText amount={salePrice} />

                    </View>
                )}
                {barCode && (
                    <View style={styles.direction}>
                        <Label text={"BarCode : "} size={14} />
                        <Label text= {barCode} size={14} />

                    </View>
                )}
               

            </View>
            {status && (
                <Status
                    status={status} backgroundColor={status === Active.ACTIVE_TEXT ? Color.GREEN : Color.CANCEL_BUTTON}
                />
            )}

        </TouchableOpacity>
    );
};

export default PriceListCard;


