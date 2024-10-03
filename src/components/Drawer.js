import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, View } from 'react-native';

const Drawer = ({ isOpen, children, closeDrawer, height }) => {
    if (!isOpen) return null;

    const windowHeight = Dimensions.get('window').height;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
        >
            <View style={[styles.modalContainer]}>
                <View style={[styles.modalContent, { height: height ? height : windowHeight * 0.6 }]}>
                    <View style={styles.closeButton}>
                        <MaterialIcons name="close" size={30} color="gray" onPress={() => closeDrawer()} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{height:'100%'}} >
                            {children}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    );
};



export default Drawer;
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalContent: {
        backgroundColor: '#242E36',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
})