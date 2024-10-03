import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import PublicLayout from "../../../components/Layout/PublicLayout";
import PhoneNumber from "../../../components/PhoneNumber";
import Select from "../../../components/Select";
import TextInput from "../../../components/TextInput";
import VerticalSpace10 from "../../../components/VerticleSpace10";
import ObjectName from "../../../helper/ObjectName";
import { keyboardVerticalOffset } from "../../../helper/keyboardVerticalOffset";
import PublicRouteService from "../../../services/PublicRouteService";
import Media from "./Media";
import Spinner from "../../../components/Spinner";

const JobCandidateForm = (props) => {
    const params = props && props?.route && props?.route?.params && props?.route?.params;
    const [phoneNumber, setPhoneNumber] = useState(params?.phone || "")
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const navigation = useNavigation()
    const [genderValue, setGenderValue]=useState(null);
    const [isLoading, setIsLoading]=useState(false)


    const preloadedValues = {
        firstName: "",
        phone_number: "",
        lastName: "",
        gender: ""
        
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: preloadedValues
    });

    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value)
    }

    const uploadImage = async (id) => {
        if (file) {

            const data = new FormData();

            let mediaFile = {
                type: file?._data?.type,
                size: file?._data.size,
                uri: image,
                name: file?._data.name
            }

            data.append("media_file", mediaFile)

            data.append("image_name", file?._data.name);

            data.append("name", file?._data.name);

            data.append("media_name", file?._data.name);

            data.append("object", ObjectName.CANDIDATE);

            data.append("object_id", id);

            data.append("media_url", image);

            data.append("media_visibility", 1);

            data.append("feature", 1);

            await PublicRouteService.createMedia(data,(error, response)=>{
                if (response) {
                    setIsLoading(false)
                    navigation.navigate("SuccessScreen")
                }
                setFile("");
                setImage("");
                reset()
                setGenderValue(null)
            })
     
        } else {
        }
    }

    
    const hamdleFormSubmit = async (values) => {
        setIsLoading(true)
        let data = new Object()
        data.firstName = values.firstName
        data.lastName = values.lastName
        data.phone = values?.phone_number
        data.positionType = params?.data?.label
        data.position = params?.data?.label
        data.gender = genderValue

            await PublicRouteService.createCandidate(data, (err, response) => {
                if (response && response.data && response.data.candidateId) {
                    if (file) {
                        uploadImage(response.data.candidateId)
                    } else {
                        setIsLoading(false)
                        navigation.navigate("SuccessScreen")
                    }
                }
            })
    }

    let genderOption =[
        {
            label:"Male",
            value:"Male"
        },
        {
            label:"Female",
            value:"Female"
        },
    ]

    const onGenderChange =(value)=>{
        setGenderValue(value)
    }
    if(isLoading){
        return <Spinner/>
    }

    return (
        <PublicLayout
            title="Candidate Form"
            showBackIcon
            buttonLabel={"Apply"}
            buttonOnPress={handleSubmit(values => { hamdleFormSubmit(values) })}
        >

            <ScrollView automaticallyAdjustKeyboardInsets={true}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : 'position'}
                    keyboardVerticalOffset={keyboardVerticalOffset()}
                >
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <Media image={image ? image : ""} allowCamera  prefillImage={params?.media_url} setImage={setImage} setFile={setFile} />

                        <VerticalSpace10 />

                        <TextInput
                            title="First Name"
                            name="firstName"
                            control={control}
                            required
                        />
                        <VerticalSpace10 />
                         <>                          
                          <TextInput
                                title="Last Name"
                                name="lastName"
                                control={control}
                                required
                                />
                                <VerticalSpace10 />
                                </>

                        <PhoneNumber
                            title="Phone Number"
                            name="phone_number"
                            control={control}
                            values={phoneNumber}
                            onInputChange={handlePhoneNumberChange}
                            required={true}
                        />
                          <Select
                            label={"gender"}
                            placeholder={"Select Gender"}
                            control={control}
                            options={genderOption}
                            OnSelect={onGenderChange}
                            data={genderValue}
                            required
                        />

                        <VerticalSpace10 paddingBottom={70} />

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>

        </PublicLayout>
    )

}
export default JobCandidateForm