import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Color } from '../../helper/Color';
import { verticalScale } from "../Metrics";
import RadioButton from '../RadioButton';
import Currency from '../Currency';
import { useForm } from "react-hook-form";
import { PaymentType } from "../../helper/PaymentType";
import MediaUploadCard from '../MediaUploadCard';
import Button from "../../components/Button";

function GeneralModal({
  toggle,
  MediaData,
  modalVisible,
  dateAndTime,
  button2Press,
  handlePaymentChange,
  button1Press,
  content,
  content2,
  button1Label,
  button2Label,
  disable,
  label,
  title,
  selectedPayment,
  takePicture,
  handleDelete,
  showDelete,
  enableButton,
  isSubmit
}) {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#00000099",
    },
    modalContainer: {
      width: "80%",
      maxHeight: '80%',
      borderRadius: 5,
      backgroundColor: "#f9fafb",
      overflow: 'hidden',
    },
    modalHeader: {
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalBody: {
      padding: 20,
      backgroundColor: "#fff",
      alignItems: "center",
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      color: Color.BLACK,
      flexShrink: 1,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: "lightgray",
    },
    closeButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    actionText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700",
    },
    dateTimeContainer: {
      width: "100%",
      paddingBottom: 20,
    },
    contentContainer: {
      alignItems: "flex-start",
      marginBottom: 20,
    },
    contentText: {
      fontSize: 30,
    },
    content2Container: {
      alignItems: 'center',
      marginBottom: 20,
    },
    content2Text: {
      color: "red",
      fontWeight: "bold",
      fontSize: 40,
    },
    paymentContainer: {
      width: '100%',
      marginBottom: 20,
    },
    paymentRow: {
      flexDirection: "row",
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    paymentRadio: {
      flexDirection: "row",
      justifyContent: 'space-between',
      marginTop: 10,
    },
    currencyContainer: {
      width: '49%',
      flex: 0.5,
    },
    addMediaText: {
      color: "blue",
      fontWeight: "bold",
      fontSize: 14,
    },
    mediaContainer: {
      width: '100%',
      marginBottom: 20,
    },
    errorText: {
      color: "red",
      marginTop: 10,
    },
    currencyContainerWithPadding: {
      width: '49%',
      flex: 0.5,
      paddingLeft: 10,
    }
  });

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => toggle && toggle()}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={() => toggle && toggle()} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          {/* Body */}
          <ScrollView contentContainerStyle={styles.modalBody}>
            {dateAndTime && <View style={styles.dateTimeContainer}>{dateAndTime}</View>}
            {content && (
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>{content}</Text>
              </View>
            )}
            {content2 && (
              <View style={styles.content2Container}>
                <Text style={styles.content2Text}>{content2}</Text>
              </View>
            )}
            {handlePaymentChange && (
              <View style={styles.paymentContainer}>
                <View style={styles.paymentRow}>
                  <RadioButton
                    label="Cash"
                    value="cash"
                    checked={selectedPayment === 1}
                    onPress={() => handlePaymentChange(1)}
                  />
                  <RadioButton
                    label="UPI"
                    value="upi"
                    checked={selectedPayment === 2}
                    onPress={() => handlePaymentChange(2)}
                  />
                </View>
                <RadioButton
                  label="Both"
                  value="both"
                  checked={selectedPayment === 3}
                  onPress={() => handlePaymentChange(3)}
                />
                {selectedPayment === 3 && (
                  <View style={styles.paymentRadio}>
                    <View style={styles.currencyContainer}>                    
                      <Currency
                        title={'Cash'}
                        name={'cash'}
                        control={control}
                        placeholder="Cash"
                        edit
                        required
                      />
                    </View>
                    <View style={styles.currencyContainerWithPadding}>
                      <Currency
                        title={'Paytm'}
                        name={'upi'}
                        control={control}
                        placeholder="Paytm"
                        edit
                        required
                      />
                    </View>
                  </View>
                )}
                {selectedPayment === PaymentType.INITIAL && (
                  <Text style={styles.errorText}>Select Payment Method</Text>
                )}
              </View>
            )}
            {(selectedPayment === PaymentType.UPI_VALUE ||
              selectedPayment === PaymentType.MIXED_VALUE) && (
              <View style={styles.mediaContainer}>
                <Text style={{ color: "black", fontWeight: "bold", marginBottom: 10 }}>
                  Photos {MediaData && MediaData.length > 0 && `(${MediaData.length})`}
                  {MediaData && MediaData.length > 0 && (
                    <Text onPress={takePicture} style={styles.addMediaText}> + Add</Text>
                  )}
                </Text>
                <MediaUploadCard
                  mediaData={MediaData}
                  size={40}
                  isOrder
                  onUploadIconPress={takePicture}
                  showDelete={showDelete}
                  onPressDelete={handleDelete}
                />
              </View>
            )}
          </ScrollView>
          <View style={styles.divider} />
          {/* Footer */}
          <View style={styles.modalFooter}>
          <View style={[styles.actionButton, { backgroundColor: Color.PRIMARY }]}>
              <Button isDisabled={enableButton}title={button1Label} backgroundColor={Color.PRIMARY} isSubmit = {isSubmit} onPress={selectedPayment ? handleSubmit(button1Press) : () => {
                button1Press && button1Press();
                toggle && toggle();
              }}/>
            </View>
            {button2Label && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Color.SECONDARY_BUTTON }]}
                onPress={() => {
                  toggle && toggle();
                  button2Press && button2Press();
                }}
              >
                <Text style={styles.actionText}>{button2Label}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default GeneralModal;
