// Import React and Component
import React, { useState } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { MaterialIcons } from "@expo/vector-icons";

import DatePicker from "../../../components/DatePicker";

import inventoryTransferService from "../../../services/InventoryTransferService";
import { Color } from "../../../helper/Color";
import TransferField from "../../../components/TransferField";
import Divider from "../../../components/Divider";
import VerticalSpace10 from "../../../components/VerticleSpace10";

const GeneralTab = (props) => {

    const [selectedDate, setSelectedDate] = useState(props?.date ? new Date(props?.date) : new Date());

    const { fromLocationName, toLocationName, transferId, allowEdit, date, type, typeName, toLocationId, fromLocationId, notes, offlineMode,transferNumber, manageOthers, currentStatusId, onStoreUpdate } = props
    const navigation = useNavigation();
    const params = {
        transferId: transferId,
        toLocationId: toLocationId,
        fromLocationId: fromLocationId,
        date: date,
        type: type,
        fromLocationName: fromLocationName,
        toLocationName: toLocationName,
        notes: notes,
        offlineMode: offlineMode,
        currentStatusId: currentStatusId,
        transferNumber : transferNumber
    }

    const onStoreClick = (destinationStore) => {
        params.destinationStore = destinationStore;
        navigation.navigate("StoreSelector", { onSelectStore: onStoreUpdate, params })
    }

    const onDateSelect = (date) => {
        let selectedDate = new Date(date);
        setSelectedDate(selectedDate)
        if (params.transferId) {
            inventoryTransferService.updateInventory(params.transferId, { date: selectedDate }, (error, response) => {
                params.date = selectedDate
                navigation.navigate("Transfer/ProductList",
                    params
                );

            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10, padding: 10 }}>

                <View
                    style={styles.dateContainer}>
                    <DatePicker title="Date"
                        onDateSelect={onDateSelect}
                        disabled={allowEdit}
                        selectedDate={selectedDate ? selectedDate : new Date(date)} />
                </View>

                <TransferField title ="From Location"
                    onPress={(e) => { allowEdit && onStoreClick("fromStoreSelect") }}
                    label={fromLocationName}
                    disabled = {allowEdit}
                />
                 <Divider/>
                 <VerticalSpace10 />
                <TransferField title ="To Location"
                    onPress={(e) => { allowEdit && onStoreClick("toStoreSelect") }}
                    label={toLocationName}
                    disabled = {allowEdit}

                />
                 <Divider/>
                 <VerticalSpace10 />
                 <TransferField title ="Type"
                    label={typeName}
                    disabled = {allowEdit}

                />
               <Divider/>
               <VerticalSpace10 />
                 <TransferField title ="Notes"
                 onPress={(e) => {
                    allowEdit && navigation.navigate("inventoryTransfer/NotesArea", params)
                }}
                   disabled = {allowEdit}
                    label={notes ? notes : "Add Your Notes Here"}
                />
                 <Divider/>
                 <VerticalSpace10 />

               
            </View>
        </View>
    );
};

export default GeneralTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    containers: {
        height: 60,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
    dateContainer: {
        height: 80,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    }
});
