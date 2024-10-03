import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import AlternativeColor from "../../components/AlternativeBackground";
import Label from "../../components/Label";
import NoRecordFound from "../../components/NoRecordFound";
import PhoneNumber from "../../components/PhoneNumberText";
import UserCard from "../../components/UserCard";
import IdText from "../../components/IdText";
import DateText from "../../components/DateText";
import DateTime from "../../lib/DateTime";
import { Color } from '../../helper/Color';
import styles from "../../helper/Styles";
import Status from "../../components/Status";


const CandidateCard = ({ candidateList }) => {
    const navigation = useNavigation()
    return (
        <>
            {candidateList && candidateList.length > 0 ? (
                candidateList.map((item, index) => {
                    const containerStyle = AlternativeColor.getBackgroundColor(index)

                    return (
                        <TouchableOpacity style={[styles.orderAlign, containerStyle]} onPress={() => navigation.navigate("Candidate/Form", { item })}
                        >
                            <View
                                style={{
                                    paddingHorizontal: 11,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {item?.candidate_url ? (
                                    <Image source={{ uri: item?.candidate_url }} style={{ width: 55, height: 55, borderRadius: 30 }} />
                                ) : (
                                    <UserCard
                                        size={45}
                                        showFullName={false}
                                        firstName={item.firstName}
                                        bgColor={Color.PRIMARY}
                                    />
                                )}

                            </View>
                            <View style={styles.infoContainer}>
                            <View style ={styles.direction}>
                                <IdText id ={item.candidateId}/>
                                <DateText  date = {DateTime.formatedDate(item?.createdAt)} />
                                </View>
                                <View style ={styles.direction}>
                                <Label text={item?.firstName} bold={true} size={14} />
                                <Label text={item?.lastName} bold={true} size={14} />
                                </View>
                                {item.position && (
                                <Text>{item.position}</Text>
                                )}
                                <PhoneNumber phoneNumber={item?.phone} />
                            </View>
                            {item?.statusText && (
                              <Status
                              status={item?.statusText} backgroundColor={item.statusColor}/>
                            )}
                           
                        </TouchableOpacity>
                    );
                })
            ) : (
                <NoRecordFound iconName="receipt" styles={{ paddingVertical: 250, alignItems: "center" }} />
            )}
        </>
    )
}
export default CandidateCard;
