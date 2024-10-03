import React from "react";
import { Text, View } from "react-native";
import { Color } from "../../helper/Color";
import VerticalSpace10 from "../../components/VerticleSpace10";
import {useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const HeaderCard = ({ name, locationName }) => {
    const navigation = useNavigation();

    return (
        <>
       <View style={styles.headerContainer}>
    <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.greetingText}
    >
        Hello!&nbsp;
        <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.nameText}
        >
            {name}
        </Text>
    </Text>
   
</View>



            <VerticalSpace10 />
            <View style={{ }}>
  <Text style={styles.locationText}>Your Location: 
    {locationName ? (
      <Text style={styles.locationNameText}> {locationName}</Text>
    ) : (
      <>
        <Text style={styles.noLocationText}>
          No Location Selected 
          <Text 
            onPress={() => navigation.navigate("Settings/SelectStore", {isLocationChange: true})}
            style={styles.selectText}
          >
             (Select)
          </Text>
        </Text>
      </>
    )}
  </Text>
</View>

                     
        </>
    );
};

const styles = StyleSheet.create({
  headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
  },
  greetingText: {
      color: Color.RED,
      fontSize: 20,
      fontWeight: 'bold',
      flexShrink: 1,
  },
  nameText: {
      color:Color.INDIGO,
      fontSize: 20,
      fontWeight: 'bold',
  },
  locationText: {
      color: Color.RED,
      fontSize: 15,
      fontWeight: 'bold',
  },
  locationNameText: {
      color: Color.INDIGO,
      fontSize: 15,
      fontWeight: 'bold',
  },
  noLocationText: {
      color: Color.INDIGO,
      fontSize: 15,
      fontWeight: 'bold',
  },
  selectText: {
      color: Color.BLUE,
      fontWeight: 'bold',
      fontSize: 15,
      textDecorationLine: 'underline',
  },
});

export default HeaderCard;
