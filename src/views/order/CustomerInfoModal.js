import React from 'react';
import Modal from "../../components/Modal"
import PhoneNumber from '../../components/PhoneNumber';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';


const CustomerInfoModal = ({ toggle, modalVisible, control, onNumberChange, title, confirmLabel, cancelLabel, confirmAction, cancelAction }) => {

  const modalBody = (
    <View style={styles.modalBody}>
    <PhoneNumber
    name="customer_phone_number"
    title="Customer Phone Number"
    placeholder="Phone Number"
    control={control}
    onInputChange={onNumberChange}
    maxLength={14}
/>
</View>
  )
  return (
    <>
      <Modal
        title={title}
        modalBody={modalBody}
        toggle={toggle}
        modalVisible={modalVisible}
        button1Label={confirmLabel}
        button1Press={confirmAction}
        button2Label={cancelLabel}
        button2Press={cancelAction}
      />
    </>
  )
}

export default CustomerInfoModal;

const styles = StyleSheet.create({

  modalBody: {
      backgroundColor: "#fff",
      paddingVertical: 10,
      paddingHorizontal: 10
  },
 
});
