import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import Layout from '../../components/Layout';
import userService from '../../services/UserService';
import { TouchableOpacity } from 'react-native';
import PhoneNumberText from "../../components/PhoneNumberText";
import { StyleSheet } from 'react-native';
import UserCard from '../../components/UserCard';

const EditProfile = (props) => {

    const [detail, setDetail] = useState(null);
    const [data, setData] = useState(null);

    const isFocused = useIsFocused();
    const navigation = useNavigation();


    useEffect(() => {
        getDetail();
    }, [isFocused])

    useEffect(() => {
        getAddressData();
    }, [detail?.id])

  


    let getDetail = async () => {
        await userService.getProfileData((err, res) => {
            setDetail(res && res?.data)

        })
    }     

    let getAddressData = async () => {
        if(detail?.id){
            await userService.get(detail?.id && parseInt(detail?.id), (err, response) => {
                if (response && response.data) {              
                    setData(response.data)
                }
            })
        }
      
    }



    return (
        <Layout
            title={`Edit Profile`}
            showBackIcon={true}
        >
            <View style={styles.profileContainer}>
               <UserCard
                image={detail?.avatarUrl}
                mobileNumber={detail?.mobile}
                textStyle={{ fontSize: 18, fontWeight: 'bold' }}
                avatarStyle={{ width: 100, height: 100, borderRadius: 50 }}
                firstName={detail?.name}
                lastName ={detail?.lastName}
                size = {80}
              />
                
                 </View>
                 <Card style={styles.addressCard}>
                 <View style={styles.addressHeader}>
                        <Text style={styles.addressTitle}>Address</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("addressForm")} }>
                            <Text style={styles.editText}>{"Edit"}</Text>
                        </TouchableOpacity>
                    </View>
                    {data?.address1 && (
                    <>
                    <Text style={styles.addressText}>{data?.address1}</Text>
                    <Text style={styles.addressText}>{data?.address2}</Text>
                    <View style={styles.direction}>
                    {data?.city && <Text>{data?.city}</Text> } 
                    {data?.state && <Text>, {data?.state}</Text>}
                    {data?.pin_code && <Text>, {data?.pin_code}</Text>}
                    </View>
                    </>
                    )}
                    </Card>
        </Layout>
    );
};
const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileInfo: {
        marginLeft: 10,
    },
    nameText: {
        fontWeight: "bold",
        fontSize: 20,
    },
    mobileText: {
        fontWeight: "bold",
    },
    addressCard: {
        marginBottom: 10,
        marginTop: 10,
        paddingBottom: 10,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    addressTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    editText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    addressText: {
        paddingHorizontal: 16,
    },
    direction: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
});



export default EditProfile;
