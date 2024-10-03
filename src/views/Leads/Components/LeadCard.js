import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTime from "../../../lib/DateTime";
import UserCard from "../../../components/UserCard";
import Status from "../../../components/Status";
import DateText from "../../../components/DateText";
import IdText from "../../../components/IdText";
import PhoneNumber from "../../../components/PhoneNumberText";
import styles from "../../../helper/Styles";
import Label from "../../../components/Label";
const LeadCard = (props) => {
    const {
        date, name, id, onPress, alternative, status, statusColor, mobile_number,firstName,lastName,imageUrl
    } = props;
    return (
        <TouchableOpacity activeOpacity={1.2} style={[styles.leadContainer, alternative]} onPress={onPress}>
            <View style={styles.infoContainer}>
            <UserCard firstName={firstName} lastName = {lastName} size={20} image ={imageUrl}/>    
            <View>
            <View style={[styles.direction,styles.alignType]}>

                    {id && (
                        <IdText id={id} />
                    )}

                    <DateText date={DateTime.formatDate(date)} />

                </View>
                <View style = {styles.alignType}>

              <Label text={name} size={14} fontWeight={'600'}/>
              </View>
              <View style = {styles.alignType}>
                <PhoneNumber phoneNumber={mobile_number} />
                </View>

            </View>
            </View>
           {status && (
                <Status
                    status={status} backgroundColor={statusColor}
                />
                )}
          

        </TouchableOpacity>
    );
};
export default LeadCard;

