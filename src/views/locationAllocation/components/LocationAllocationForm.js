import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import Layout from "../../../components/Layout";
import VerticalSpace10 from "../../../components/VerticleSpace10";
import DatePicker from "../../../components/DatePicker";
import { useState } from "react";
import LocationAllocationService from "../../../services/LocationAllocationService";


const LocationAllocationForm = () => {

    const [selectedDate, setSelectedDate]=useState(null)
    const [isSubmit,setIsSubmit] = useState(false)
    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            date: selectedDate ? selectedDate :""
        }
    });

    const handleAdd = async (values) => {
        setIsSubmit(true)
        const createDate = {
            date: selectedDate ? selectedDate :""
        }

        await LocationAllocationService.create(createDate, async (err, response) => {
            if (response) {
                setIsSubmit(false)
                navigation.navigate("LocationAllocation")
            }else{
                setIsSubmit(false)
            } 
        })
    }


    const onDateSelect =(date)=>{
        setSelectedDate(date)
    }

    const onDateClear =()=>{
        setSelectedDate(null)
    }

    return (
        <Layout
            title={"Add Location Allocation"}
            showBackIcon
            buttonLabel={"Add"}
            buttonOnPress={handleSubmit(values => { handleAdd(values); })}
            isSubmit = {isSubmit}

        >
            <VerticalSpace10 />
            <DatePicker
                                title="Date"
                                name="date"
                                onDateSelect={onDateSelect}
                                onClear={onDateClear}
                                selectedDate={selectedDate ? selectedDate : null}
                                required={true}
                                control={control}
                            />

            <VerticalSpace10 />
        </Layout>
    )
}
export default LocationAllocationForm;