import React from "react";
import { ScrollView } from "react-native";
import TextInput from "../../../components/TextInput";
import VerticalSpace10 from "../../../components/VerticleSpace10";
import Select from "../../../components/Select";
import { useState } from "react";
import Status from "../../../helper/Status";


const LocationSettingTab = ({ storeDetail, editPermission, control,updateLocationStatusPermission }) => {
    const [ipAddress, setIpAddress]=useState(storeDetail?.ip_address);
    const [cashInStore, setCashInStore]=useState(storeDetail?.minimum_cash_in_store)



let handleIpAddress =(value)=>{
setIpAddress(value)
}

let handleCashInStore=(value)=>{
    setCashInStore(value)
}


    return (


        <ScrollView>
            <VerticalSpace10 />
            <Select
                label={"Status"}
                name="status"
                control={control}
                options={[
                    {
                        label: Status.ACTIVE_TEXT,
                        value: Status.ACTIVE_TEXT
                    },
                    {
                        label: Status.INACTIVE_TEXT,
                        value: Status.INACTIVE_TEXT
                    }
                ]}
                data={storeDetail?.status}
                placeholder={"Select Status"}
                disable={(!editPermission == false) && (updateLocationStatusPermission == true) ? false :  true}

            />

            <VerticalSpace10 />

            <TextInput
                title="Ip Address"
                name="ipAddress"
                placeholder="Ip Address"
                editable={editPermission}
                values={ipAddress}
                onInputChange={handleIpAddress}
                control={control} />
            <VerticalSpace10 />

            <TextInput
                title="Minimum Cash In Store"
                name="minimumCashInStore"
                placeholder="Minimum Cash In Store"
                control={control}
                editable={editPermission}
                values={cashInStore}
                onInputChange={handleCashInStore}
            />

        </ScrollView>



    );
};

export default LocationSettingTab;
