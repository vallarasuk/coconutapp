import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AlternativeColor from '../../../components/AlternativeBackground';
import styles from '../../../helper/Styles';

const ContactCard = ({ name, phone_number, email, designation, onRowClick, index }) => {

    const containerStyle = AlternativeColor.getBackgroundColor(index)

    return (
        <TouchableOpacity style={[styles.listContainer, containerStyle]} onPress={onRowClick} >
            <View style={{ flex: 1, marginLeft: 0, padding: 0 }}>
                <View style={{ marginLeft: 3 }}>
                    {name && <Text style={style.name}>{name}</Text>}
                    {designation && <Text><Text style={[style.name,{fontSize:12}]}>Designation:</Text> {designation}</Text>}
                    {phone_number && <Text><Text style={[style.name,{fontSize:12}]}>Phone:</Text> {phone_number}</Text>}
                    {email && <Text><Text style={[style.name,{fontSize:12}]}>Email:</Text> {email}</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    name: {
      fontWeight: "bold",
    },
  });



export default ContactCard;
