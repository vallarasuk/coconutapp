import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../helper/Styles';
import Label from './Label';
import VerticalSpace10 from './VerticleSpace10';
import { Color } from '../helper/Color';

const FileSelectModal = ({ isOpen, closeDrawer, takePhoto, uploadPhoto }) => {
    if (!isOpen) return null;
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isOpen}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <View style={styles.closeButton}>
              <MaterialIcons name="close" size={30} color= {Color.GREY} onPress={() => closeDrawer()} />
            </View>
            <View style={styles.optionContainer}>
              <TouchableOpacity onPress={() => takePhoto()}>
                <View style = {styles.direction}>
                <MaterialIcons name="photo-camera" size={40} color={Color.ACTIVE} style = {{marginRight : 10}}/> 
                <Label text={"Take Photo"} size={20} />
                </View>
               
              </TouchableOpacity>
              <VerticalSpace10 />
              <VerticalSpace10 />
              <TouchableOpacity onPress={() => uploadPhoto()}>
              <View style = {styles.direction}>
                <MaterialIcons name="photo-library" size={40} color= {Color.BLUE} style = {{marginRight : 10}}/> 
                <Label text={"Choose File"} size={20} />
                </View>
               
              </TouchableOpacity>
              <VerticalSpace10 />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

export default FileSelectModal;
