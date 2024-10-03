import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Device from "../../lib/Device";
import LocationService from "../../services/StoreService";
import AttendanceService from "../../services/AttendanceService";
import Layout from "../../components/Layout";
import { Color } from "../../helper/Color";
import Button from "../../components/Button";
import LocationSelector from "../../components/LocationSelector";

const LocationConfirmation = (props) => {

    let params = props?.route?.params

    const [locationDetail, setLocationDetail] = useState("");

    const [isLoading, setLoading] = useState(false);

    const [isLocationLoading, setLocationLoading] = useState(false);

    const focused = useIsFocused();

    const navigation = useNavigation();

    useEffect(() => {
        getLocation();
    }, [focused])

    const getLocation = async () => {
        setLocationLoading(true);
        Device.getDeviceLocation((location) => {
            setLocationLoading(false);
            getLocationDetail(location);
        });
    }

    const getLocationDetail = (locationData) => {

        setLoading(true);

        let params = new Object();

        if (locationData) {
            params.longitude = locationData?.longitude;
            params.latitude = locationData?.latitude;
        }

        LocationService.GetLocationByIpAndGeoLocation(params, (err, response) => {
            if (response && response.data && response.data.locationDetail) {
                setLocationDetail(response.data.locationDetail)
            }
            setLoading(false);
        });
    }

    const onCheckInStoreSelect = (selectedStore) => {
        if (selectedStore) {
            AttendanceService.CheckIn(selectedStore.id, navigation, params?.redirectUrl, setLoading);
        }
    }

    return (
        <Layout
            title={"Select Location"}
            isLoading={isLoading || isLocationLoading}
            bottomToolBar={false}
            showBackIcon={true}

        >
            {locationDetail ? (
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <View style={{ flex: 0.3 }}></View>
                    <View style={{ flex: 0.7, alignItems: "center" }}>
                        <Text style={{ color: Color.RED, fontSize: 18, fontWeight: 'bold' }}>Your Location:
                            <Text style={{ color: Color.INDIGO, fontSize: 18, fontWeight: 'bold' }}> {locationDetail.name}</Text>
                        </Text>
                        <View style={{ marginTop: 15 }}>
                            <Button title={"Next"} backgroundColor={Color.GREEN} onPress={() => onCheckInStoreSelect(locationDetail)} />
                        </View>
                    </View>

                </View>
            ) : (
                <LocationSelector onPress={onCheckInStoreSelect} locationByRole={true}/>
            )}
        </Layout>
    )
}

export default LocationConfirmation;