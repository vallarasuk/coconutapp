import React, { useState } from 'react';
import { Modal, View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { Color } from '../helper/Color';
import { MaterialIcons } from '@expo/vector-icons';
import VerticalSpace10 from './VerticleSpace10';
import Button from './Button';
import styles from '../helper/Styles';

const FilterDrawer = ({ isOpen, children, closeDrawer, height, applyFilter, confirmButtonTitle, backgroundColor }) => {
    if (!isOpen) return null;

    const windowHeight = Dimensions.get('window').height;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
        >
            <View style={[styles.modalContainer]}>
                <View style={[styles.modalContent, { height: height ? windowHeight * height : windowHeight * 0.98, backgroundColor: backgroundColor ? backgroundColor : Color.WHITE }]}>
                    <View style={[styles.closeButton]}>
                        <MaterialIcons name="close" size={30} color={Color.GREY} onPress={() => closeDrawer()} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ScrollView>
                            {children}
                        </ScrollView>
                    </View>
                    <View >
                        <View style={styles.applyButton}>
                            <Button title={confirmButtonTitle ? confirmButtonTitle : 'APPLY FILTER'} backgroundColor={Color.PRIMARY} onPress={() => applyFilter()} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};



export default FilterDrawer;
