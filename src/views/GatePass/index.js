import React, { useEffect, useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from "react-native";
import Layout from "../../components/Layout";
import activityService from "../../services/ActivityService";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Spinner from "../../components/Spinner";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
import LoadMoreButton from "../../components/LoadMoreButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../../helper/Color";
import NoRecordFound from "../../components/NoRecordFound";
import Label from "../../components/Label";
import ShowMore from "../../components/ShowMore"
import Refresh from "../../components/Refresh"
import styles from "../../helper/Styles";
import Media from "../../helper/Media";
import ObjectName from "../../helper/ObjectName";
import gatePassService from "../../services/GatePassService";
import DateTime from "../../lib/DateTime";
import AlternativeColor from "../../components/AlternativeBackground";
import UserCard from "../../components/UserCard";
import PermissionService from "../../services/PermissionService";
import Permission from "../../helper/Permission";


const GatePass = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const isFocused = useIsFocused();
    const [gatePass,setGatePass] = useState([])
    const [permission, setPermission] = useState("")
    const [HasMore, setHasMore] = useState(true);

    const navigation = useNavigation();
    useEffect(()=>{
        let mount = true;
        mount && getGatePassList()
        mount && addPermission();
        return () => {
            mount = false;
        };
    },[isFocused])
    useEffect(()=>{
        if(refreshing){
            getGatePassList()
        }

    },[refreshing])

    const getGatePassList = async () => {
       
        gatePass && gatePass.length == 0 && setIsLoading(true)
    
        await gatePassService.search(null,
            (err, response) => {
                let gatePass = response && response?.data ;
                setGatePass(gatePass.data)
                setIsLoading(false);
                setRefreshing(false)

            });

    }
    const addPermission = async () => {
        const addPermission = await PermissionService.hasPermission(Permission.GATE_PASS_ADD);
        setPermission(addPermission);
        
    }
    

    return (

        <Layout
            title="Gate Pass"
            addButton={permission ? true : false}
            isLoading={isLoading}
            refreshing={refreshing}
            buttonOnPress={() => {
                navigation.navigate("GatePassMedia")
            }}
            showBackIcon={false}

        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
            <View>
                    {gatePass && gatePass.length > 0 ? gatePass.map((item,index) => {
                        const containerStyle = AlternativeColor.getBackgroundColor(index)

                        return (

                            <TouchableOpacity style={[styles.leadContainer, containerStyle]} onPress ={() => {
                                navigation.navigate("GatePassMedia",{item})
                            }}
                            >
                                <View style={styles.row} >
                                    <View>
                                    <UserCard
                                            firstName={item.first_name}
                                            lastName={item.last_name}
                                            image={item.owner_media_url}
                                        />
                                        {item.notes && (
                                            <View style={styles.row}>
                                            <Text>{item.notes}</Text>
                                        </View>
                                        )}
                                        
                                        <View style={styles.row}>
                                            <Text>{(item.createdAt)}</Text>
                                        </View>

                                    </View>

                                </View>
                                
                            </TouchableOpacity>
                        )
                    }) : 
                    <NoRecordFound iconName={"receipt"}/>

                    }
                    <ShowMore List={gatePass} isFetching={isFetching} HasMore={HasMore} />

                </View>
            </Refresh>
        </Layout >
    );
};

export default GatePass;

