import React, { useEffect, useRef, useState } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
} from "react-native";
import Layout from "../../components/Layout";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import NoRecordFound from "../../components/NoRecordFound";
import Refresh from "../../components/Refresh";
import leadService from "../../services/LeadService";
import LeadCard from "./Components/LeadCard";
import PermissionService from "../../services/PermissionService";
import Permission from "../../helper/Permission";
import { SwipeListView } from "react-native-swipe-list-view";
import styles from "../../helper/Styles";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";

const Leads = () => {
    const [lead, setLead] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);
    const [permission, setPermission] = useState("");
    const [leadDeleteModalOpen,setLeadDeleteModalOpen] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [deletePermission, setDeletePermission] = useState("")

    const stateRef = useRef();









    const navigation = useNavigation();

    useEffect(() => {
        let mount = true;
        mount && getLeadList();

        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused]);
    useEffect(() => {
        if(refreshing){
            getLeadList();
        }
}, [refreshing]);

    useEffect(() => {
        let mount = true;
        mount && addPermission()
        //cleanup function
        return () => {
            mount = false;
        };
    }, [refreshing]);

    const addPermission = async () => {
        const addPermission = await PermissionService.hasPermission(Permission.LEADS_ADD);
        setPermission(addPermission);
        const deletePermission = await PermissionService.hasPermission(Permission.LEADS_DELETE);
        setDeletePermission(deletePermission);

    }

    const getLeadList = async () => {
        lead && lead.length == 0 && setIsLoading(true);
        await leadService.search(null, (error, response) => {
            setLead(response && response.data && response.data.data)
            setIsLoading(false);
            setRefreshing(false)

        });

    }


    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            ///Api call
            leadService.search({ page: page }, (error, response) => {
                let leads = response.data.data;
                // Set response in state
                setLead((prevTitles) => {
                    return [...new Set([...prevTitles, ...leads])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(leads.length > 0);
                setIsFetching(false);
            })

        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };
    const clearRowDetail = () => {
        if (stateRef) {
            const selectedItem = stateRef.selectedItem;
            const selectedRowMap = stateRef.selecredRowMap;
            if (selectedItem && selectedRowMap) {
                closeRow(selectedRowMap, selectedItem.id)
                setSelectedItem("");
                stateRef.selectedItem = "";
                stateRef.selecredRowMap = "";
            }
        }
    }
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }
    const leadDeleteModalToggle = () => {
        setLeadDeleteModalOpen(!leadDeleteModalOpen);
        clearRowDetail();
    }

    const leadDelete = async () => {
        if (selectedItem) {
            leadService.delete(selectedItem.id, (error, response) => {
                getLeadList()
            })
        }
    };
    
    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => {
                        leadDeleteModalToggle()
                        setSelectedItem(data?.item);
                        stateRef.selectedItem = data?.item;
                        stateRef.selecredRowMap = rowMap;
                        closeRow(rowMap, data?.item.id);
                    }}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>

        )
    };

    const renderItem = data => {
        let item = data?.item;
        let index = data?.index;
        const containerStyle = AlternativeColor.getBackgroundColor(index)
        return (
            <LeadCard
                id={item.id}
                date={item.date}
                name={item.name}
                mobile_number={item.mobile_number}
                status={item.status_name}
                firstName = {item.first_name}
                lastName = {item.last_name}
                statusColor={item.color_code}
                alternative={containerStyle}
                imageUrl = {item.image_Url}
                onPress={() => {
                    navigation.navigate("LeadForm", { item });
                }}

            />
        );
    };

    const addNew = () => {
        navigation.navigate("LeadForm")
    }

    return (
        <Layout
            title='Leads'
            addButton={permission ? true : false}
            buttonOnPress={addNew}
            isLoading={isLoading}
            refreshing={refreshing}
            showBackIcon={false}



        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing} >


                <View>
                           <DeleteConfirmationModal
                            modalVisible={leadDeleteModalOpen}
                            toggle={leadDeleteModalToggle}
                            item={selectedItem}
                            updateAction={leadDelete}
                            
                            id={selectedItem?.id}

                        />
                    {lead && lead.length > 0 ? (

                        <SwipeListView
                            data={lead}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-70}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            disableRightSwipe={true}
                            disableLeftSwipe={deletePermission ? false : true}
                            closeOnRowOpen={true}
                            keyExtractor={item => String(item.id)}
                        />
                    ) : (
                        <NoRecordFound iconName="receipt" />

                    )}

                    <ShowMore List={lead} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
                </View>
            </Refresh>

        </Layout>
    )
}
export default Leads;


