import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import VerticalSpace10 from "../../components/VerticleSpace10";
import Name from "../../components/Name";
import { useForm } from "react-hook-form";
import accountService from "../../services/AccountService";
import { useNavigation } from "@react-navigation/native";
import Status from "../../helper/Status";
import PhoneNumber from "../../components/PhoneNumber";
import { Account } from "../../helper/Account";
import TextInput from "../../components/TextInput";
import addressServices from "../../services/AddressService";
import { ScrollView } from "react-native";
import CountrySelect from "../../components/CountrySelect";
import StateSelect from "../../components/StateSelect";
import PinCode from "../../components/PinCode"


const CustomerAdd = (props) => {
    const params = props?.route?.params;
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [title, setTitle] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [country,setCountry] = useState("");
    const [state,setStateValue] = useState("");
    const [countryId,setCountryId] = useState("");
    const [gstNumber,setGstNumber] = useState("");
    const [isSubmit,setIsSubmit] = useState(false)






    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({});
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value)
    }
    const onInputChange = (value) => {
        setAddress1(value)
    }
    const onAddressChange = (value) => {
        setAddress2(value)
    }
    const onCityChange = (value) => {
        setCity(value)
    }
    const onTitleChange = (value) => {
        setTitle(value)
    }
    const onPinCodeChange =(value)=>{
        setPinCode(value)
    }
    const onLongitudeChange=(value)=>{
        setLongitude(value)
    }
    const onLatitudeChange=(value)=>{
        setLatitude(value)
    }
    const CountryOnChange=(value)=>{
         setCountry(value.label)
         setCountryId(value.value)
    }
    const StateOnChange = (value)=>{
        setStateValue(value.label)
    }
    const onGSTChange = (value)=>{
        setGstNumber(value)
    }


    const AddCustomer = async (values) => {
        const createDate = {
            vendor_name: values?.vendor_name,
            status: Status.ACTIVE,
            accountCategory: Account.TYPE_CUSTOMER,
            mobile: values?.mobile,




        }

        setIsSubmit(true)
        await accountService.create(createDate, async (err, response) => {
            if (response) {
                const addressData = {
                    address1: values?.address1 ? values?.address1 : address1,
                    address2: values?.address2 ? values?.address2 : address2,
                    vendor_id: response && response?.data && response?.data?.vendor_id,
                    city: values?.city ? values?.city : city,
                    title: values?.title ? values?.title : title,
                    pin_code : values?.pin_code ? values?.pin_code : pinCode,
                    longitude : values?.longitude ? values?.longitude : longitude,
                    latitude : values?.latitude ? values?.latitude : latitude,
                    country :  values?.country && values?.country?.label ? values?.country?.label : country,
                    state :  values?.state && values?.state?.label ? values?.state?.label : state,
                    gst_number : values?.gst_number ? values?.gst_number : gstNumber,


                }
                if (addressData) {
                    await addressServices.create(addressData, async (err, response) => {
                        if (response) {
                            setIsSubmit(false)
                            navigation.navigate("CustomerSelector",{
                                reDirectUrl: params.reDirectUrl,
                                onSelectCustomer: params.onSelectCustomer
                            })

                        }else{
                            setIsSubmit(false)
                        }
                    })
                }
            }

        })
    }

    return (
        <Layout
            title={"Add Customer"}
            buttonLabel={"Save"}
            buttonOnPress={handleSubmit(values => { AddCustomer(values); })}
            isSubmit={isSubmit}

        >
            <ScrollView>
            <VerticalSpace10 />

            <TextInput
                title={"Title"}
                name="title"
                placeholder="Enter Title"
                control={control}
                onInputChange={onTitleChange}
                required
            />
            <VerticalSpace10 />
            <Name
                title={"Name"}
                name="vendor_name"
                control={control}
                required={true} />

            <VerticalSpace10 />
            <PhoneNumber
                title="Phone Number"
                name="mobile"
                control={control}
                required
                values={phoneNumber}
                onInputChange={handlePhoneNumberChange}
            />
            <VerticalSpace10 />
            <TextInput
                title={"Address 1"}
                name="address1"
                placeholder="Enter Address 1"
                control={control}
                onInputChange={onInputChange}
            />
            <VerticalSpace10 />

            <TextInput
                title={"Address 2"}
                name="address2"
                placeholder="Enter Address 2"
                control={control}
                onInputChange={onAddressChange}
            />
            <VerticalSpace10 />

            <TextInput
                title={"City"}
                name="city"
                placeholder="Enter City"
                control={control}
                onInputChange={onCityChange}
            />
            <VerticalSpace10 />
            <CountrySelect
              control={control}
              label = {"Country"}
              name = {"country"}
              placeholder="Select Country"
              onChange={CountryOnChange}


            />
           <VerticalSpace10 />
           <StateSelect 
             control={control}
             label = {"State"}
             name = {"state"}
             placeholder="Select State"
             onChange={StateOnChange}
             countryId = {countryId}

           />
            <VerticalSpace10 />


            <PinCode
                title = {"Pin Code"}
                name = {"pin_code"}
                control={control}
                onInputChange={onPinCodeChange}
            />
            <VerticalSpace10 />
            <TextInput
                title={"GST Number"}
                name="gst_number"
                placeholder="Enter GST Number"
                control={control}
                keyboardType = "numeric"
                onInputChange={onGSTChange}
            />
            <VerticalSpace10 />

            <TextInput
                title={"Longitude"}
                name="longitude"
                placeholder="Enter Longitude"
                control={control}
                keyboardType = "numeric"
                onInputChange={onLongitudeChange}
            />
            <VerticalSpace10 />

            <TextInput
                title={"Latitude"}
                name="latitude"
                placeholder="Enter Latitude"
                control={control}
                keyboardType = "numeric"
                onInputChange={onLatitudeChange}
            />
             <VerticalSpace10 paddingTop = {50}/>
            

            </ScrollView>


        </Layout>
    )
}
export default CustomerAdd;