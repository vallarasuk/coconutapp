import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Keyboard
} from "react-native";
import inventoryTransferService from "../../services/InventoryTransferService";
import InventoryCard from "./components/TransferCard";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AlternativeColor from "../../components/AlternativeBackground";
import Refresh from "../../components/Refresh";
import ShowMore from "../../components/ShowMore";
import NoRecordFound from "../../components/NoRecordFound";
import StatusService from "../../services/StatusServices";
import ObjectName from "../../helper/ObjectName";
import TransferType from "../../helper/TransferType";
import SearchBar from "../../components/SearchBar";
import BarCodeScanner from "../../components/BarcodeScanner";
import AlertMessage from "../../helper/AlertMessage";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";


const DistributionList = (props) => {

    const [isLoading, setIsLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);

    const [allTransfer, setAlltransfer] = useState([]);
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const [status, setStatus] = useState(null);
    const [id, setId] = useState(id);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [modalVisible, setScanModalVisible] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [transferNotFoundModalOpen, setTransferNotFoundModalOpen] = useState(false);






    const navigation = useNavigation();    



    useEffect(() => {
        let mount = true;
    
        mount && getList({search : searchPhrase})

        return () => {
          mount = false;
        };

    }, [isFocused])

    useEffect(() => {
        if(refreshing){
            getList({search : searchPhrase})
        }

    }, [refreshing])    


    const getList = async (values) => {
        try {
            
            let status = await StatusService.list(
                ObjectName.TRANSFER
            );
            const filteredStatuses = status.filter(status => status.update_transferred_quantity === 1);
            const statusId = filteredStatuses.map(status => status.status_id);
            setStatus(statusId)
            
             allTransfer && allTransfer.length == 0 && statusId && setIsLoading(true);
            let param

            param = { page: 1, status: statusId,search : values ? values?.search : "" }

            inventoryTransferService.search(param, (err, response) => {
                let transfers = response && response?.data && response?.data?.data;
                setAlltransfer(transfers);
                setIsLoading(false);
                setRefreshing(false)


            })
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            let params = { page: page, status: status }


            inventoryTransferService.search(params, (error, response) => {

                let inventoryTransferList = response && response?.data && response?.data?.data;
                setAlltransfer((prevTitles) => {
                    return [...new Set([...prevTitles, ...inventoryTransferList])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(inventoryTransferList.length > 0);
                setIsFetching(false);
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };
    const inventoryClickHandler = async (item) => {

        if (item) {
            let isOfflineMode = item?.offlineMode == TransferType.OFFLINE_MODE ? true : false;

            if (isOfflineMode) {
                await inventoryTransferService.syncInventory(item);
            }

            setId(item.id)
            navigation.navigate("Transfer/ProductList", {
                transferId: item?.id,
                toLocationId: item?.to_store_id,
                fromLocationId: item?.from_store_id,
                date: item?.date,
                type: item?.type_id,
                fromLocationName: item?.fromLocationName,
                toLocationName: item?.toLocationName,
                transferNumber : item?.transfer_number,
                notes: item?.notes,
                offlineMode: item?.offlineMode == TransferType.OFFLINE_MODE ? true : false,
                currentStatusId: item?.currentStatusId,
                transferNumber: item?.transfer_number,
                printName: item?.printName,
                isDistribution : true,

            });
        }
    }
    const handleChange = async (search) => {
        setSearchParam(search)
        getList({search : search});



    };
    const toggle = () => {
        setScanModalVisible(!modalVisible);
    }

  const transferNotFoundToggle = () => {
    setTransferNotFoundModalOpen(!transferNotFoundModalOpen);
  }

  const onScanAction = async (item) => {

    if (item) {
      let isOfflineMode = item?.offlineMode == TransferType.OFFLINE_MODE ? true : false;

      if (isOfflineMode) {
        await inventoryTransferService.syncInventory(item);
      }

      setId(item.id)
      navigation.navigate("Transfer/ProductList", {
        transferId: item?.id,
        toLocationId: item?.to_store_id,
        fromLocationId: item?.from_store_id,
        date: item?.date,
        type: item?.type,
        fromLocationName: item?.from_location_name,
        toLocationName: item?.to_location_name,
        transferNumber : item?.transfer_number,
        notes: item?.notes,
        offlineMode: item?.offlineMode == TransferType.OFFLINE_MODE ? true : false,
        currentStatusId: item?.statusId,
        transferNumber: item?.transfer_number,
        printName: item?.printName,
        isDistribution : true
      });
    }
  }


    const handleScannedData = async (data) => {
        try {
            //get bar code
            let barCode = data?.data;

            setScannedCode(barCode)

            setScanModalVisible(false);

            //validate bar code exist and loading
            if (barCode) {

                inventoryTransferService.get(barCode, response => {

                    //validate store product exist or not
                    if (response) {

                        onScanAction(response);


                    } else {

                        transferNotFoundToggle();
                    }

                })

            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Layout
            title={"Distribution"}
            showBackIcon={false}
            isLoading={isLoading}
            refreshing={refreshing}
            showScanner={true}
            openScanner={toggle}


        >

            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                setClicked={setClicked}
                clicked={clicked}
                setSearch={setSearch}
                onPress={getList}
                handleChange={handleChange}
                noScanner
            />
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
                <BarCodeScanner
                    toggle={toggle}
                    modalVisible={modalVisible}
                    handleScannedData={handleScannedData}
                />
                <ConfirmationModal
                    toggle={transferNotFoundToggle}
                    modalVisible={transferNotFoundModalOpen}
                    title={AlertMessage.TRANSFER_NOT_FOUND}
                    description={`BarCode ID ${scannedCode} not found please scan different code`}
                    confirmLabel={"Ok"}
                    ConfirmationAction={transferNotFoundToggle}
                />


                {allTransfer && allTransfer.length > 0 ? (allTransfer.map((item, index) => {
                    const containerStyle = AlternativeColor.getBackgroundColor(index)

                    return (
                        <View >
                            <InventoryCard
                                fromLocationName={item?.fromLocationName}
                                toLocationName={item?.toLocationName}
                                status={item?.status}
                                statusColor={item.statusColor}
                                date={item?.date}
                                type={item?.type}
                                item={item}
                                alternative={containerStyle}
                                transferNumber={item?.transfer_number}
                                onPress={() => {
                                    inventoryClickHandler(item);
                                }}

                            />
                        </View>
                    )
                })) : (
                    <NoRecordFound iconName={"receipt"} />

                )}
                <ShowMore List={allTransfer} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

            </Refresh>

        </Layout>
    )

}
export default DistributionList;
