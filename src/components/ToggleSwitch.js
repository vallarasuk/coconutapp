import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Label from './Label';
import { Color } from '../helper/Color';

const CustomToggleSwitch = ({ value, text, onValueChange }) => {
    return (
        <View style={styles.toggle}>
            <Label text={text} size={16} />
            <TouchableOpacity
                style={[
                    styles.toggleSwitch,
                    { backgroundColor: value ? Color.BLACK : Color.SWITCH_GREY },
                ]}
                onPress={() => onValueChange(!value)}
            >
                <View style={[styles.toggleThumb, { left: value ? '50%' : 0 }]} />
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    toggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    toggleSwitch: {
        width: 40,
        height: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleThumb: {
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: Color.LIGHT_GRAY,
        position: 'absolute',
    },
});

export default CustomToggleSwitch;
