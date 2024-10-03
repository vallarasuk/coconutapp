// Import React and Component
import React, { useState } from "react";

import { TouchableOpacity, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

//Footer and Header
import Layout from "../../components/Layout";

import { Color } from "../../helper/Color";
import { StyleSheet } from "react-native";

const Replenish = (props) => {
    //Loading
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const Link = ({ label, icon, backgroundColor, materialIcon, redirectUrl }) => {

        return (
            <>
                <View style={styles.linkContainer}>
                <View style={[styles.iconContainer, { backgroundColor }]}>
                        <TouchableOpacity onPress={()=> navigation.navigate(redirectUrl)}>
                            {materialIcon ? (
                                <MaterialCommunityIcons name={icon} size={30} color={Color.DARK_YELLOW} />
                            ) : (
                                <FontAwesome5 name={icon} size={20} color={Color.DARK_YELLOW} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.linkLabel}>{label}</Text>
                </View>
            </>
        )
    }

    return (
        <Layout
            title={"Replenish"}
            isLoading={isLoading}
            showBackIcon={false}

        >
            <View style={styles.mainContainer}>

                <Link label={"Store Replenish"} icon={"warehouse"} backgroundColor={Color.LIGHT_YELLOW} materialIcon redirectUrl={"StoreReplenish"}/>

                <Link label={"Product Replenish"} icon={"box-open"} backgroundColor={Color.LIGHT_YELLOW} redirectUrl={"ProductReplenish"} />

                <Link label={"Replenishment Products"} materialIcon icon={"transfer"} backgroundColor={Color.LIGHT_YELLOW} redirectUrl={"ReplenishmentProduct"} />

            </View>
            
        </Layout>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: 40,
    },
    linkContainer: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    linkLabel: {
      marginTop: 10,
    },
  });

export default Replenish;
