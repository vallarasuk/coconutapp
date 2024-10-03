import * as Sharing from "expo-sharing";
import React, { useRef } from "react";
import { Button, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import ViewShot from "react-native-view-shot";
import ArrayList from "../../../lib/ArrayList";
import String from "../../../lib/String";

const ShareModal = ({ visible, onClose, locationList, filteredShifts, date, isRecord, detail, userList }) => {
    const viewShotRef = useRef(null);

    const handleShare = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await Sharing.shareAsync(uri).then((res)=>{
                onClose && onClose()
            });
        } catch (error) {
            console.error("Error sharing image:", error);
        }
    };

    const renderUserDetail = (location, shift) => {
        let isDetail =
            (ArrayList.isArray(detail) &&
                detail.find(
                    (data) =>
                        data.location_id === location.id && data.shift_id === shift.id
                )) ||
            null;
        let userValue =
            (ArrayList.isArray(userList) &&
                userList.find((data) => data?.id == isDetail?.user_id)) ||
            null;

        return isRecord(location, shift) ? String.concatName(userValue?.firstName, userValue?.lastName) : "";
    };

    const isLastCell = (currentIndex, list) => currentIndex === list.length - 1;

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1.0 }} style={{ width: "100%" }}>
                        <View style={styles.modalContent}>
                            <View style={styles.table}>
                                <Text style={[styles.label, styles.headerCell, { fontSize: 13, backgroundColor: "yellow", borderBottomWidth: 1 }]}>
                                    {`Store Allocation - ${date}`}
                                </Text>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.label, styles.headerCell, { fontSize: 13, backgroundColor: "yellow" }]}>Store</Text>
                                    {ArrayList.isArray(filteredShifts) && filteredShifts.map((shift, index) => (
                                        <Text key={index} style={[styles.label, styles.headerCell, { fontSize: 13, backgroundColor: "yellow", borderRightWidth: isLastCell(index, filteredShifts) ? 0.2 : 1, borderRightColor: "black" }]}>
                                            {shift?.name}
                                        </Text>
                                    ))}
                                </View>
                                {ArrayList.isArray(locationList) && locationList.map((location, locationIndex) => (
                                    <View key={locationIndex} style={[styles.tableRow, { borderBottomWidth: isLastCell(locationIndex, locationList) ? 0 : 1, borderRightColor: "black" }]}>
                                        <Text style={[styles.label, styles.bodyCell, { fontSize: 10, fontWeight: "bold", textAlign: "left", padding: 2, backgroundColor: "#f4f4f6" }]}>
                                            {location.name}
                                        </Text>
                                        {ArrayList.isArray(filteredShifts) && filteredShifts.map((shift, shiftIndex) => (
                                            <Text key={shiftIndex} style={[styles.label, styles.bodyCell, { fontSize: 10, fontWeight: "bold", padding: 2, borderRightWidth: isLastCell(shiftIndex, filteredShifts) ? 0 : 1, borderRightColor: "black" }]}>
                                                {renderUserDetail(location, shift)}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ViewShot>
                </ScrollView>
            </View>
            <View style={{ flexDirection: "row", padding: 20,  gap: 2  }}>
                <View style={{ flex: 1 }}>
                    <Button title="Close" onPress={onClose} />
                </View>
                <View style={{ flex: 1 }}>
                    <Button color={"green"} title="Share" onPress={handleShare} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minWidth:"100%"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "100%",
        minWidth:"100%"
    },
    scrollViewContent: {
        flexGrow: 1,
        width: "100%",
    },
    table: {
        borderWidth: 1,
        borderColor: "black",
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    label: {
        flex: 1,
        textAlign: "center",
        paddingVertical: 10,
    },
    headerCell: {
        borderRightWidth: 1,
        borderRightColor: "black",
        fontWeight: "bold",
    },
    bodyCell: {
        borderRightWidth: 1,
        borderRightColor: "black",
    },
});

export default ShareModal;
