import React from 'react';

import BottomDrawer from "../components/BottomDrawer";

import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

import { Color } from '../helper/Color';

const ActionMenuDrawer = ({ isOpen, onClose, actionMenus }) => {

    return (
        <>
            <BottomDrawer isOpen={isOpen} closeDrawer={onClose} title={"Brand"} height={actionMenus.length == 1 ? actionMenus.length *0.25 : actionMenus.length * 0.11} confirmButtonTitle={"CANCEL"} backgroundColor={Color.LIGHT_GRAY} applyFilter={onClose}>

                {actionMenus && actionMenus.length > 0 && actionMenus.map((data) => {

                    return (
                        <TouchableOpacity onPress={() => {
                            onClose();
                            data.onPress(data.value)
                        }}>
                            <View style={[styles.container, { backgroundColor: Color.WHITE, marginVertical: 5, paddingVertical: 7, borderRadius: 10 }]}>
                                <Text style={styles.text}>{data.label}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </BottomDrawer>
        </>
    )
};

export default ActionMenuDrawer;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    text: {
        marginVertical: 5,
    },
});