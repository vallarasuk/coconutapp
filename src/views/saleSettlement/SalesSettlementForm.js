// Import React and Component
import React, { useState } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View,
  TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import SaleSettlementService from "../../services/SaleSettlementService";
import Currency from "../../components/Currency";
import CurrenCy from "../../lib/Currency";
import TextArea from "../../components/TextArea";
import VerticalSpace10 from "../../components/VerticleSpace10";
import DateTime from "../../lib/DateTime";
import asyncStorageService from "../../services/AsyncStorageService";
import style from "../../helper/Styles";
import CustomAlertModal from "../../components/CustomAlertModal";
import ObjectName from "../../helper/ObjectName";
import { Label } from "../../helper/Label";
import Media from "../../helper/Media";
import MediaUploadCard from "../../components/MediaUploadCard";
import { Text } from "react-native-paper";
import Button from "../../components/Button";
import { Color } from "../../helper/Color";
import mediaService from "../../services/MediaService";

const SalesSettlementForm = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amountCash, setAmountCash] = useState("");
  const [amountUpi, setAmountUpi] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const navigation = useNavigation();

  const [id, setId] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportModel, setReportModel] = useState(false);
  const [videoModel, setVideoModel] = useState(false);
  const [reportAlert, setReportAlert] = useState();
  const [videoAlert, setVideoAlert] = useState();
  const [MediaData, setMediaData] = useState([]);
  const [video, setVideo] = useState([]);
  const [isSubmit,setIsSubmit] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: preloadedValues });

    const getMediaList = async (id) => {
      await mediaService.search(id, "SALE_SETTLEMENT", callback => setMediaData(callback && callback?.data? callback?.data?.data:[]))
  }

  const preloadedValues = {
    amount_cash: amountCash ? amountCash : "",
    amount_upi: amountUpi ? amountUpi : "",
    cash_in_store: "",
    cash_to_office: "",
    notes: "",
  };
  const takePicture = async () => {
    const image = await Media.getImage();
    if (image && image.assets) {
      const url = image.assets[0];
      setReportData((prevImages) => [...prevImages,  url ]);
      setReportModel(false)
    }
  };
  const takeVideo = async () => {
    const image = await Media.getVideo();
    if (image && image.assets) {
      const url = image.assets[0];
      setVideo((prevVideo) => [...prevVideo,  url ]);
      setVideoModel(false)
    }
  };

  const handleDelete = (index) => {
    try {
      setReportData((prevImages) => {
        // Filter out the image at the specified index
        return prevImages.filter((_, i) => i !== index);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleNotesOnChange = (value) => {
    setNotes(value)

  }
  const onCashChange = (value) => {
    const cashAmount = value;

    setAmountCash(value)
    if (cashAmount) {
      let totalAmounts = CurrenCy.Get(cashAmount) + CurrenCy.Get(amountUpi)
      setTotalAmount(totalAmounts || "")
    }
    setAmountCash(cashAmount)
  };

  const onUpiChange = (value) => {
    const upiAmount = value;

    if (upiAmount) {
      let total_amount = CurrenCy.Get(amountCash) + CurrenCy.Get(upiAmount)

      setTotalAmount(total_amount || "")
    }
    setAmountUpi(upiAmount)
  };

  const uploadMedia = async (id) => {
    try {
      let media = [...reportData, ...video];

      if (media && media.length > 0) {
        for (const image of media) {
          const response = await fetch(image.uri);
          const blob = await response.blob();
          await Media.uploadImage(
            id,
            blob,
            image.uri,
            ObjectName.SALE_SETTLEMENT,
            null,
            null,
            async (response) => {
            }
          );
        }
      }
      getMediaList(id)
    } catch (err) {
      console.log(err);
    }
  };
  const getMessage = async (response,id) =>{
    try{
      let message = '';
      if (response && response.orderCash > 0) {
        message += `Missing Order Cash Amount: ${CurrenCy.getFormatted(response.orderCash)}\n`;
      }
      if (response && response.orderUpi > 0) {
        message += `Missing Order PayTM Amount: ${CurrenCy.getFormatted(response.orderUpi)}\n`;
      }
      if (response && response.storeAmount > 0) {
        message += `Missing Store Amount: ${CurrenCy.getFormatted(response.storeAmount)}\n`;
      }
      if (message !== "") {
        setAlertMessage(message);
        setAlertTitle("Order Amount Missing");
        setModalVisible(true);
      }else{
        if ((reportData && reportData.length !== 0) &&(video && video.length !== 0) ) {
        navigation.navigate("SalesSettlement", {
          id: id,
          object: ObjectName.SALE_SETTLEMENT,
        })
        resetValues()
      }
      }
    }catch(err){
      console.log(err);
    }
  }

  const resetValues = () => {
    reset({});
    setId("");
    setAmountCash("");
    setAmountUpi("");
    setTotalAmount("");
    setNotes("");
    setReportData([]);
    setVideo([]);
    setVideoModel(false)
    setReportModel(false)
  };
  const addSales = async (values) => {
    let storeId = await asyncStorageService.getSelectedLocationId();

    let createData = new Object();

    createData.date = DateTime.formatDate(selectedDate);

    (createData.storeId = storeId),
      (createData.total_amount =
        CurrenCy.Get(amountCash) + CurrenCy.Get(amountUpi));

    createData.amount_cash = amountCash;

    createData.amount_upi = amountUpi;

    createData.cash_in_store = values.cash_in_store;

    createData.cash_to_office = values.cash_to_office;

    createData.notes = notes;

    createData.productCount = values.productCount;

    if (reportData && reportData.length == 0) {
       setReportModel(true)
       setReportAlert("Sales Report is missing")
    }
    if (video && video.length == 0) {
       setVideoAlert("PayTM Video is Missing")
       setVideoModel(true)
    }
    if (id) {
      SaleSettlementService.update(id, createData, (response) => {
        getMessage(response,id)
        if(MediaData&& MediaData.length == 0){
          uploadMedia(id)
          setIsSubmit(false)
        }
      })
    }else{
      SaleSettlementService.create(createData, (error, response) => {
        let id = response.data.id
        setId(id)
        uploadMedia(id)
        getMessage(response.data,id)
        setIsSubmit(false)
      })}
  }

  const handleAlertClose = () => {
    try{
      if ((reportData?.length == 0) || (video?.length == 0) ) {
        setModalVisible(false);
      }else{
        setModalVisible(false);
        // Logic to navigate and reset fields after closing the alert
        navigation.navigate("SalesSettlement", {
          id: id,
          object: ObjectName.SALE_SETTLEMENT,
        });
        resetValues();
      }

        // Logic to navigate and reset fields after closing the alert
        
    }catch(err){
      console.log(err);
    }
  };
  const handleContinue = () => {
    try{
        setModalVisible(false);
     
    }catch(err){
      console.log(err);
    }
  };
  const handleVideoModel = () => {
    try{
        setVideoModel(false);
       
    }catch(err){
      console.log(err);
    }
  };
  const handleImageModel = () => {
    try{
        setReportModel(false);
       
    }catch(err){
      console.log(err);
    }
  };
  const updateValue = () => {
    resetValues();
    navigation.navigate("SalesSettlement");
  };

  const onSubmit = (values) => {
    setIsSubmit(true)
    addSales(values);
  };

  /* Render flat list funciton end */
  return (

    <Layout
      title="Add Sales Settlement"
      showBackIcon={true}
      updateValue={updateValue}
      backButtonNavigationUrl={"SalesSettlement"}
    >
      <CustomAlertModal
        visible={modalVisible}
        message={alertMessage}
        title={alertTitle}
        subTitle="Do you want to change?"
        buttonOptions={[
          { label: Label.TEXT_YES, onPress: () => handleContinue() },
          { label: Label.TEXT_NO, onPress: () => handleAlertClose() }
        ]}
      />
      <CustomAlertModal
        visible={videoModel}
        title={videoAlert}
        message="Please Upload PayTM Video"
        onClose={handleVideoModel}
        buttonOptions={[
          { label: Label.TEXT_UPLOAD, onPress: () => takeVideo() },
        ]}
      />
       <CustomAlertModal
        visible={reportModel}
        message="Please Upload sales report"
        title={reportAlert}
        onClose={handleImageModel}
        buttonOptions={[
          { label: Label.TEXT_UPLOAD, onPress: () => takePicture() },
        ]}
      />
      <ScrollView 
      keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          <VerticalSpace10 />

            <View>
              <Currency
                name="amount_cash"
                title="Order Cash Amount"
                control={control}
                placeholder="Cash Amount"
                onInputChange={onCashChange}
                required={true}
                edit

              />
            </View>
            <VerticalSpace10 />

            <View>
              <Currency
                name="amount_upi"
                control={control}
                title="Order Upi Amount"
                placeholder="Upi Amount"
                onInputChange={onUpiChange}
                required
                edit
              />
          </View>

          <VerticalSpace10 />
            <View>
              <Currency
                title="Store Cash Amount"
                name="cash_in_store"
                control={control}
                placeholder="Store Cash"
                required={true}
                edit
              />
            </View>
          <VerticalSpace10 />

            <View>
              <Currency
                title="Cash To Office"
                name="cash_to_office"
                control={control}
                placeholder="Cash To Office"
                required={true}
                edit
              />
          </View>
          <VerticalSpace10 />

          <TextArea
            title={"Notes"}
            name="notes"
            placeholder="Notes"
            control={control}
            onInputChange={handleNotesOnChange}
            value={notes}

          />
          <VerticalSpace10 />

        </View>
        <View style={styles.row}>
          <Text style={styles.reportText}>
          Sales Report{" "}
            {reportData && reportData.length > 0 && <>({reportData?.length}):</>}
          </Text>
          {reportData && reportData.length > 0 && (
            <TouchableOpacity onPress={takePicture} style={styles.button}>
              <Text style={styles.buttonText}>{"+ Add"}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.uploadSection}>
          <MediaUploadCard
            mediaData={reportData}
            size={40}
            isOrder
            showDelete={false}
            onUploadIconPress={takePicture}
            buttonLabel="+ Add Image"
            buttonStyle={styles.centeredButton} // Center button label
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.reportText}>
          PayTM Video {video && video.length > 0 && <>({video?.length}):</>}
          </Text>
          {video && video.length > 0 && (
            <TouchableOpacity onPress={takeVideo} style={styles.button}>
              <Text style={styles.buttonText}>{"+ Add"}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.uploadSection}>
          <MediaUploadCard
            mediaData={video}
            size={40}
            isOrder
            onUploadIconPress={takeVideo}
            buttonLabel="+ Add Video"
            buttonStyle={styles.centeredButton}
          />
        </View>
      </ScrollView>
      <View>
        <Button
          title={"COMPLETE"}
          backgroundColor={Color.BLACK}
          onPress={handleSubmit(onSubmit)}
          isSubmit = {isSubmit}
        />
      </View>
    </Layout >
  );
};

export default SalesSettlementForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },

  container1: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  item: {
    width: "50%",
  },
  uploadSection: {
    padding: 5,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredButton: {
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically centered
  },
  reportText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center", // Center the button text vertically
    marginLeft: 10, // Add some space between Report and Add
  },
  buttonText: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
  },
});
