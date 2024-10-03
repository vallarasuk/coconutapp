import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import LocationModal from './component/locationModal';
import Layout from '../../components/Layout';
import MapView, { Marker } from 'react-native-maps';

const AddAddress = (props) => {
    let addressDetail = props && props.route && props.route.params && props.route.params.item
    const [mapRegion, setMapRegion] = useState({});
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [locationDetails, setLocationDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const windowHeight = Dimensions.get('window').height;

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    };

    const getCurrentLocation = async () => {
        const hasLocationPermission = await requestLocationPermission();
        setIsLoading(true);
        if (hasLocationPermission) {
            try {
                if (addressDetail && addressDetail.latitude && addressDetail.longitude) {

                    const { latitude, longitude } = addressDetail;

                    setMapRegion({
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                    });

                    const address = await Location.reverseGeocodeAsync({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
                    setLocationDetails(address[0]);

                } else {
                    const location = await Location.getCurrentPositionAsync({ timeInterval: 2000 });
                    const { latitude, longitude } = location.coords;

                    if (latitude && longitude) {
                        setMapRegion({
                            latitude,
                            longitude,
                        });

                        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
                        setLocationDetails(address[0]);
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const locationModalToggle = () => {
        setShowDetailsModal(!showDetailsModal);
    };


    const onSelectLocation = async (event) => {
        if (event && event.nativeEvent && event.nativeEvent.coordinate) {
            setMapRegion({ latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude });
            const address = await Location.reverseGeocodeAsync({ latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude });
            if (address && address.length > 0) {
                setLocationDetails(address[0]);
            }
        }
    }

    return (
        <Layout
            title={'Select Location'}
            showbackicon={true}
            hideContentPadding
            hideFooterPadding
        >
            <View style={{ flex: 1, width: '100%' }}>
                {mapRegion && mapRegion.latitude && mapRegion.longitude && (
                    <MapView
                        provider={"google"}
                        style={{
                            height: windowHeight * 0.85,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        zoomEnabled={true}
                        zoomTapEnabled={true}
                        loadingEnabled={true}
                        showsUserLocation={true}
                        onLongPress={onSelectLocation}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        showsBuildings={true}
                        followsUserLocation={true}
                        region={{
                            latitude: mapRegion.latitude,
                            longitude: mapRegion.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}

                    >
                        <Marker
                            onSelect={onSelectLocation}
                            coordinate={{
                                latitude: mapRegion.latitude,
                                longitude: mapRegion.longitude,
                            }}
                        />
                    </MapView>
                )}


                <TouchableOpacity style={styles.locationButton} onPress={locationModalToggle}>
                    <MaterialIcons name="my-location" size={24} color="white" style={styles.icon} />
                    <Text style={styles.buttonText}>Use Current Location</Text>
                </TouchableOpacity>

                {showDetailsModal && (
                    <LocationModal
                        locationModalToggle={locationModalToggle}
                        locationModalVisible={showDetailsModal}
                        locationDetail={locationDetails}
                        addressDetail={addressDetail}
                        mapRegion={mapRegion}
                        closeDrawer={locationModalToggle}
                    />
                )}
            </View>
        </Layout>
    );
};

export default AddAddress;

const styles = StyleSheet.create({
    locationButton: {
        backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});
