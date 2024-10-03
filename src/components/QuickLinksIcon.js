import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Color } from '../helper/Color';

const QuickLinksIcon = ({ iconName, label, label1, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.icon}>
        <FontAwesome5 name={iconName} size={30} color={Color.INDIGO} />
      </View>
      <Text style={styles.iconName}>{label}</Text>
      {label1 && (
        <Text style={styles.iconName1}>{label1}</Text>
      )}
    </TouchableOpacity>
  );
};

export default QuickLinksIcon;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  icon: {
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconName: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: 'bold',
    color: Color.RED,
  },
  iconName1: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Color.RED,
  },
});
