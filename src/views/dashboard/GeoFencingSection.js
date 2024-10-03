import React, { useEffect, useState } from 'react';
import DateTime from '../../lib/DateTime';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { StyleSheet, Text, View } from 'react-native';
import VerticalSpace10 from '../../components/VerticleSpace10';
import UserLocationService from '../../services/UserLocation';
import * as Location from 'expo-location';
import { Color } from '../../helper/Color';
import styles from '../../helper/Styles';


const Geofencing = () => {

    const [getLocation,setGetLocation] = useState()
    const [isSubmit,setIsSubmit] = useState(false)

    const handleHerePress =async ()=>{
      try{
        setIsSubmit(true)
        let location = await Location.getCurrentPositionAsync({});

        let data = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
    
        UserLocationService.create(data, (err, result) => { 
            if(result){
                setGetLocation(result)
                setIsSubmit(false)

            }else{
              setIsSubmit(false)
            }
        })
      } catch (err) {
        setIsSubmit(false)
        console.log(err);
      }
      

    }
  return (
    <View>
      <Card
        title="Geofencing"
      >
        <VerticalSpace10/>
        <View style={styles.cardBody}>
        
            <View>
            <Text>Last Geofenced At : </Text>
            <Text>
               {getLocation ? DateTime.formatedDate(new Date()) : ""}
            </Text>
            </View>

          
          <Button
            title="I Am Here"
            onPress ={handleHerePress}
            backgroundColor = {Color.GREY}
            isSubmit = {isSubmit}
          />
        </View>

      </Card>
    </View>
  );
};

export default Geofencing;


