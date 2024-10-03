import React, { useEffect } from 'react';
import { View, Dimensions, Modal, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import AsyncStorageObject from '../../../lib/AsyncStorage';
import AsyncStorage from '../../../helper/AsyncStorage';
import AddressService from '../../../services/AddressService';
import { useNavigation } from '@react-navigation/native';
import ObjectName from '../../../helper/ObjectName';
import TextInput from '../../../components/Text'
import { Color } from '../../../helper/Color';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../helper/Styles';
import Button from '../../../components/Button';

const LocationModal = ({ locationModalVisible, locationModalToggle, locationDetail, addressDetail, closeDrawer, mapRegion }) => {

    let address = locationDetail?.formattedAddress ? locationDetail.formattedAddress : ""

    let address2 = addressDetail &&  addressDetail.address2 ? addressDetail.address2.split(','): "";

    const navigation = useNavigation();

    const windowHeight = Dimensions.get('window').height;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({});

    useEffect(() => {
        setInitialValue()
    }, []);

    const setInitialValue = () => {
        if (locationDetail) {
            setValue("flatNo", address2  && address2.length > 0 ? address2[0] : "");
            setValue("buildingName", address2  && address2.length > 0 ? address2[1] : "");
            setValue("fullName", addressDetail && addressDetail.name ? addressDetail.name : "");
            setValue("address", address);
            setValue("city", addressDetail && addressDetail.city ? addressDetail.city : locationDetail?.city);
            setValue("pinCode", addressDetail && addressDetail.pin_code? addressDetail.pin_code : locationDetail?.postalCode);
        }
    }

    const handleSaveAddress = async (values) => {

        const userId = await AsyncStorageObject.getItem(AsyncStorage.USER_ID)
        const userName = await AsyncStorageObject.getItem(AsyncStorage.USER_NAME)

        let address2
        if (values.flatNo && values.buildingName) {
            address2 = values.flatNo + "," + values.buildingName
        }

        let createData = {
            name: values.fullName,
            address1: values.address,
            country: locationDetail.country ? locationDetail.country : addressDetail.country,
            state: locationDetail.region ? locationDetail.region : addressDetail.state,
            city: locationDetail.city ? locationDetail.city : addressDetail.city,
            userName: addressDetail ? addressDetail.name : userName,
            pin_code: locationDetail.postalCode ? locationDetail.postalCode : addressDetail.pincode,
            user_id: userId,
            object_name: ObjectName.USER,
            latitude: mapRegion.latitude ? mapRegion.latitude : "",
            longitude: mapRegion.longitude ? mapRegion.longitude : "",
        }
        if (address2) {
            createData.address2 = address2
        }

        if (addressDetail && addressDetail.id) {
            if (addressDetail.id) {
                createData.id = addressDetail.id

            }
            await AddressService.update(addressDetail.id, createData, async (err, response) => {
                if (response) {
                    locationModalToggle()
                    navigation.goBack()
                }
            })
        } else {
            await AddressService.create(createData, async (error, response) => {
                if (response) {
                    locationModalToggle()
                    navigation.goBack()
                }

            })
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={locationModalVisible}
        >
            <KeyboardAvoidingView style={{ flex: 1, justifyContent: "flex-end" }} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>

                <View style={[styles.modalContent, { height: windowHeight * 0.7, backgroundColor: Color.DRAWER_BACKGROUND }]}>
                    <View style={[styles.closeButton]}>
                        <MaterialIcons name="close" size={30} color={Color.GREY} onPress={() => closeDrawer()} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <ScrollView>
                            <TextInput
                                title={"Flat No"}
                                name="flatNo"
                                required
                                placeholder="Enter Building/ Flat No"
                                control={control}
                            />
                            <TextInput
                                title={"Building Name"}
                                name="buildingName"
                                placeholder="Enter Building Name"
                                control={control}
                                required
                            />
                            <TextInput
                                title={"Name"}
                                name="fullName"
                                placeholder="Enter Full Name"
                                placeholderTextColor={'white'}
                                control={control}
                                required
                            />

                            <TextInput
                                title={"Address"}
                                name='address'
                                required
                                style={styles.input}
                                placeholder="Address 1"
                                control={control}
                                height={80}
                                textAlignVertical={"top"}
                                multiline={true}
                            />
                            <TextInput
                                title={"City"}
                                name='city'
                                required
                                style={styles.input}
                                placeholder="Enter city"
                                control={control}
                            />

                            <TextInput
                                title="Pin Code"
                                name="pinCode"
                                placeholder="Pin Code"
                                control={control}
                                keyboardType="numeric"
                            />
                        </ScrollView>
                    </View>

                    <View style={styles.applyButton}>
                        <Button title={"Save Address"} backgroundColor={Color.DARK_RED} onPress={handleSubmit((values) => handleSaveAddress(values))} />
                    </View>

                </View>

            </KeyboardAvoidingView>
        </Modal>
    )
}
export default LocationModal;