import React, { useState } from "react";
import Layout from "../../components/Layout";
import VerticalSpace10 from "../../components/VerticleSpace10";
import Name from "../../components/Name";
import { useForm } from "react-hook-form";
import accountService from "../../services/AccountService";
import { useNavigation } from "@react-navigation/native";
import Status from "../../helper/Status";
import storeService from "../../services/StoreService";


const LocationAdd = () => {
    const [isSubmit,setIsSubmit] = useState(false)
    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const addLocation = async (values) => {
        setIsSubmit(true)
        const createDate = {
            name: values?.location_name,


        }

        await storeService.create(createDate, async (err, response) => {
            if (response) {
                setIsSubmit(false)
                navigation.navigate("Location")
            }else{
                setIsSubmit(false)
            }

        })
    }

    return (
        <Layout
            title={"Add Location"}
            showBackIcon
            buttonLabel={"Add"}
            buttonOnPress={handleSubmit(values => { addLocation(values); })}
            isSubmit = {isSubmit}

        >
            <VerticalSpace10 />
            <Name
                title={"Name"}
                name="location_name"
                control={control}
                required={true} />

            <VerticalSpace10 />
        </Layout>
    )
}
export default LocationAdd;