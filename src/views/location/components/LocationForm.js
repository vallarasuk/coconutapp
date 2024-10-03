
//React
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Linking } from "react-native";
import AddButton from "../../../components/AddButton";
import Button from "../../../components/Button";
import PhoneNumber from "../../../components/PhoneNumber";
import TextArea from "../../../components/TextArea";
import TextInput from "../../../components/TextInput";
import VerticalSpace10 from "../../../components/VerticleSpace10";
import { Color } from "../../../helper/Color";


const LocationForm = ({ storeDetail, map, editPermission, control }) => {
    const [phoneNumber, setPhoneNumber] = useState(storeDetail?.mobile_number1);
    const [locationValue, setLocationValue] = useState(storeDetail?.name)
    const [addressChange, setAddressChange] = useState(storeDetail?.address1)
    const [longitudeValue, setLongitudeValue] = useState(storeDetail?.longitude)
    const [latitudeValue, setLatitudeValue] = useState(storeDetail?.latitude)


    const openGoogleMaps = () => {
        if(storeDetail.latitude && storeDetail.longitude){
            Linking.canOpenURL("https://maps.google.com").then((supported) => {
                if (supported) {
                    const url = `https://maps.google.com/maps?q=${storeDetail.latitude},${storeDetail.longitude}`;
    
                    Linking.openURL(url);
                } else {
                    console.error("Google Maps is not installed.");
                }
            });
        }
    };


    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value)
    }

    let onLocationChange = (value) => {
        setLocationValue(value)
    }

    const onAddressChange = (value) => {
        setAddressChange(value)
    }

    const handleLongitude = (value) => {
        setLongitudeValue(value)
    }

    const handleLatitude = (value) => {
        setLatitudeValue(value)
    }

const locationNumber = storeDetail?.mobile_number1 && storeDetail?.mobile_number1.replace(/\D/g, '');

    return (


        <>
            {(!map) && (
                <ScrollView>
                    <VerticalSpace10 />

                    <TextInput
                        title="Name"
                        name="locationName"
                        placeholder="Location Name"
                        editable={editPermission}
                        values={locationValue}
                        control={control}
                        onInputChange={onLocationChange}
                    />
                    <VerticalSpace10 />


                    <TextArea
                        name="address"
                        title="Address"
                        control={control}
                        values={addressChange}
                        editable={editPermission}
                        onInputChange={onAddressChange}
                    />
                    <VerticalSpace10 />
                    <PhoneNumber
                        title="Phone Number"
                        name="mobile"
                        control={control}
                        values={phoneNumber}
                        onInputChange={handlePhoneNumberChange}
                        editable={editPermission}
                    />

                    <VerticalSpace10 />
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ width: "50%" }}>
                            <AddButton
                                label="View In Map"
                                onPress={() => {
                                    openGoogleMaps()
                                }}
                            />
                        </View>
                        <View style={{ width: "50%" }}>
                            <AddButton
                                color={Color.GREEN}
                                label="Contact Location"
                                onPress={() => {
                                    if(locationNumber){
                                        Linking.openURL(`tel:+91${locationNumber}`);
                                    }
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            )}

            {map && (


                <>
                    <VerticalSpace10 />
                    <TextInput
                        title={"Longitude"}
                        name="longitude"
                        placeholder="Enter Longitude"
                        control={control}
                        editable={editPermission}
                        keyboardType="numeric"
                        values={longitudeValue}
                        onInputChange={handleLongitude}
                    />

                    <VerticalSpace10 />
                    <TextInput
                        title={"Latitude"}
                        name="latitude"
                        placeholder="Enter Latitude"
                        control={control}
                        keyboardType="numeric"
                        editable={editPermission}
                        values={latitudeValue}
                        onInputChange={handleLatitude}
                    />
                    <VerticalSpace10 />
                    <VerticalSpace10 />


                    <Button title="Get Direction" onPress={openGoogleMaps} />
                </>
            )}

        </>

    );
};

export default LocationForm;
