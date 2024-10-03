// Import React and Component
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import Refresh from "../../components/Refresh";
import CustomFormFieldDataService from "../../services/CustomFieldValueService";
import CustomFieldService from "../../services/CustomFieldService";
import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import CustomField from "./components/CustomFormField";
import String from "../../lib/String";
import CustomFormField from "../../helper/CustomForm";
import DateTime from "../../lib/DateTime";
import ObjectName from "../../helper/ObjectName";
import PermissionService from "../../services/PermissionService";
import Permission from "../../helper/Permission";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import InspectionService from "../../services/InspectionService";
import { MenuItem } from "react-native-material-menu";

const Forms = (props) => {
    const [uplodedImages, setUploadedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [customFieldList, setCustomFieldList] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [date, setSelectedDate] = useState()
    const [actionList, setActionList] = useState([])
    const [inspectionDeletePermission, setInspectionDeletePermission] =useState(false)
    const [visible, setVisible] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [isSubmit,setIsSubmit] = useState(false)
    const navigation = useNavigation();

    let routeParams = props && props.route && props.route.params;


    const isFocused = useIsFocused();

    useEffect(() => {
        getCustomFormFieldDataList();
        getCustomFormFieldList();
    }, [isFocused,date]);

    useEffect(() => {
        getActionItems();
        editPermission();
    }, [inspectionDeletePermission])

    const editPermission = async () => {
        const deletePermission = await PermissionService.hasPermission(
          Permission.INSPECTION_DELETE
        );
        setInspectionDeletePermission(deletePermission);
      };

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const deleteModalToggle = () => {
        setDeleteModalOpen(!deleteModalOpen);
    }

    const getActionItems = async () => {
        let actionItems = new Array();

        if(inspectionDeletePermission){
            actionItems.push(
                <MenuItem
                    onPress={() => { setDeleteModalOpen(true), setVisible(true) }}
                >
                    Delete
                </MenuItem>
    
            )
        }

        setActionList(actionItems)
    }

    const getCustomFormFieldDataList = () => {
             
        if (routeParams && routeParams.inspectionId) {

            let selectedDates = new Array();

            CustomFormFieldDataService.get(routeParams.inspectionId, { tagId: routeParams.tagId, objectName: ObjectName.INSPECTION  }, (err, response) => {

                if (response && response.data && response.data.data) {

                    let customFieldDataList = response.data.data;


                    let uploadedImages = new Array();


                    if (customFieldDataList && customFieldDataList.length > 0) {

                        for (let i = 0; i < customFieldDataList.length; i++) {
                            if (customFieldDataList[i].type == CustomFormField.TYPE_FILE_UPLOAD) {
                                uploadedImages.push({
                                    fieldId: customFieldDataList[i].customFieldId,
                                    value: customFieldDataList[i].value,
                                    mediaUrl: customFieldDataList[i].mediaUrl
                                });
                            }

                            if (customFieldDataList[i].type == CustomFormField.TYPE_CURRENCY || CustomFormField.TYPE_TEXT || CustomFormField.TYPE_TEXT_AREA) {
                                setValue(`${customFieldDataList[i].customFieldId}`, customFieldDataList[i].value)
                            }

                            if (customFieldDataList[i].type == CustomFormField.TYPE_DATE) {
                                setValue(`${customFieldDataList[i].customFieldId}`, date && date);
                                selectedDates.push({ id: customFieldDataList[i].customFieldId, value: customFieldDataList[i].value })
                            }

                            if (customFieldDataList[i].type == CustomFormField.TYPE_STORE_SELECT) {
                                if (customFieldDataList[i].value) {
                                    setValue(`${customFieldDataList[i].customFieldId}`, JSON.parse(customFieldDataList[i].value))
                                }
                            }
                        }

                        setUploadedImages(uploadedImages);

                        setSelectedDates(selectedDates);

                    }
                }


            })
        }
    }

    const getCustomFormFieldList = () => {
        try {
            CustomFieldService.search({ tagId: routeParams.tagId,  objectName: ObjectName.INSPECTION }, (error, response) => {
                if (response && response.data && response.data.data) {
                    setCustomFieldList(response.data.data);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const createCustomFieldData = (values) => {

        let mediaValue;
        setIsSubmit(true)
        if (uplodedImages && uplodedImages.length > 0) {
            mediaValue = uplodedImages.reduce((acc, value) => {
                acc[value.fieldId] = value.value;
                return acc;
            }, {});
        }

        if (mediaValue) {
            Object.assign(values, mediaValue);
        }

        values = String.convertPropertiesToJSON(values);

        let bodyData = {
            objectId: routeParams.inspectionId,
            customFieldValues: values,
            objectName: ObjectName.INSPECTION
        }

        CustomFormFieldDataService.create(bodyData, (error, response) => {
            if (response) {
                reset();
                setIsSubmit(false)
                navigation.navigate("Inspection", {
                    customFormId: routeParams.customFormId,
                    customFormName: routeParams.customFormName
                }
                )
            }else{
                setIsSubmit(false)
            }
        });
    }

    const inspectionDelete = async () => {
        let inspectionId = routeParams?.inspectionId;
        if (inspectionId) {
            InspectionService.delete(inspectionId, (error, response) => {
                navigation.navigate("Inspection");
            })
        }
    };

    return (
        <Layout
            title={routeParams.locationName}
            isLoading={isLoading}
            refreshing={refreshing}
            showBackIcon={true}
            buttonLabel={"Complete"}
            buttonOnPress={handleSubmit(values => { createCustomFieldData(values) })}
            closeModal={visible}
            actionItems={actionList}
            showActionMenu={routeParams && actionList && actionList.length > 0 ? true : false}
            isSubmit={isSubmit}
        >

            <DeleteConfirmationModal
                modalVisible={deleteModalOpen}
                toggle={deleteModalToggle}
                item={routeParams?.inspectionId}
                updateAction={inspectionDelete}
                id={routeParams?.inspectionId}

            />
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

                <CustomField
                    inspectionId={routeParams.inspectionId}
                    control={control}
                    setUploadedImages={setUploadedImages}
                    uploadedImages={uplodedImages}
                    customFormFieldList={customFieldList}
                    selectedDates={selectedDates}
                    setSelectedDate = {setSelectedDate}
                    date = {date}
                    setValue = {setValue}
                />

            </Refresh>
        </Layout>
    );
};

export default Forms;

const styles = StyleSheet.create({
    align: {
        alignItems: "flex-start",
        paddingBottom: 10,
        paddingTop: 10,
    },
})
