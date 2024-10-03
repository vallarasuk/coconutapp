import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import AlternativeColor from "../../components/AlternativeBackground";
import Label from "../../components/Label";
import Layout from "../../components/Layout";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import NoRecordFound from "../../components/NoRecordFound";
import Refresh from "../../components/Refresh";
import ShowMore from "../../components/ShowMore";
import Status from "../../components/Status";
import styles from "../../helper/Styles";
import LocationAllocationService from "../../services/LocationAllocationService";
import FilterDrawer from "../../components/Filter";
import DateTime from "../../lib/DateTime";

const LocationAllocation = (props) => {
    const [locationAllocationList, setLocationAllocationList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);
    const [DeleteModalOpen, setLeadDeleteModalOpen] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [values, setValues] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const stateRef = useRef();

    const navigation = useNavigation();

    useEffect(() => {
        getLocationAllocationList(values);

    }, [isFocused]);
    useEffect(() => {
        if (refreshing) {
            getLocationAllocationList(values);

        }

    }, [refreshing])


    const getLocationAllocationList = async (value) => {
        locationAllocationList && locationAllocationList.length == 0 && setIsLoading(true);
        let param = {};

        param.sortDir = "DESC";

        if (values?.startDate) {
            param.startDate = DateTime.formatDate(values?.startDate);
        }
        if (values?.endDate) {
            param.endDate = DateTime.formatDate(values?.endDate);
        }

        await LocationAllocationService.search(param, (error, response) => {
            setLocationAllocationList(response && response.data && response.data.data)
            setIsLoading(false);
            setRefreshing(false)
        });

    }


    const LoadMoreList = async (value) => {
        try {
            setIsFetching(true);

            let param = {};

            param.sortDir = "DESC";

            if (values?.startDate) {
                param.startDate = DateTime.formatDate(values?.startDate);
            }
            if (values?.endDate) {
                param.endDate = DateTime.formatDate(values?.endDate);
            }

            param.page = page;

            LocationAllocationService.search(param, (error, response) => {
                let allocations = response.data.data;
                setLocationAllocationList((prevTitles) => {
                    return [...new Set([...prevTitles, ...allocations])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(allocations.length > 0);
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
    const DeleteModalToggle = () => {
        setLeadDeleteModalOpen(!DeleteModalOpen);
        clearRowDetail();
    }

    const handleDelete = async () => {
        if (selectedItem) {
            LocationAllocationService.delete(selectedItem?.id, (error, response) => {
                getLocationAllocationList()
            })
        }
    };

    const renderItem = data => {
        let item = data?.item;
        let index = data?.index;
        const containerStyle = AlternativeColor.getBackgroundColor(index)
        let onPress = () => {
            navigation.navigate("LocationAllocationUser", { item });
        }

        return (
            <TouchableOpacity activeOpacity={10} style={[styles.locationAllocationContainer, containerStyle]} onPress={onPress}>
                <View style={styles.infoContainer}>
                    <View>
                        <View style={{ padding: 15, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <View>
                                <Label text={item?.date} size={18} fontWeight={"600"} />
                            </View>
                            <View>
                                {item?.statusName && (
                                    <Status
                                        status={item?.statusName} backgroundColor={item?.statusColor}
                                    />
                                )}
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => {
                        DeleteModalToggle()
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


    const addNew = () => {
        navigation.navigate("LocationAllocationForm")
    }

    const closeAndOpenFilterDrawer = () => {
        setIsOpenFilter(!isOpenFilter);
    }

    const onDateSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                startDate: new Date(value),
            }));
            setSelectedDate(new Date(value));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                startDate: "",
            }));
            setSelectedDate("");
        }
    };

    const onEndDateSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                endDate: new Date(value),
            }));
            setSelectedEndDate(new Date(value));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                endDate: "",
            }));
            setSelectedEndDate("");
        }
    };

    const handleSubmit = async () => {
        getLocationAllocationList({ ...values });
        closeAndOpenFilterDrawer();
    };

    return (
        <Layout
            title="Location Allocation"
            addButton
            buttonOnPress={addNew}
            isLoading={isLoading}
            refreshing={refreshing}
            showBackIcon={false}
            onFilterPress={closeAndOpenFilterDrawer}
            showFilter
        >
            <FilterDrawer
                values={values}
                isOpen={isOpenFilter}
                closeDrawer={closeAndOpenFilterDrawer}
                onDateSelect={onDateSelect}
                onEndDateSelect={onEndDateSelect}
                selectedDate={selectedDate}
                selectedEndDate={selectedEndDate}
                showDate
                handleSubmit={handleSubmit}
                clearFilter={() => {
                    setValues("");
                    getLocationAllocationList();
                    closeAndOpenFilterDrawer();
                }}
            />
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing} >
                <View>
                    <DeleteConfirmationModal
                        modalVisible={DeleteModalOpen}
                        toggle={DeleteModalToggle}
                        item={selectedItem}
                        updateAction={handleDelete}

                        id={selectedItem?.date}

                    />
                    {locationAllocationList && locationAllocationList.length > 0 ? (

                        <SwipeListView
                            data={locationAllocationList}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-70}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            disableRightSwipe={true}
                            closeOnRowOpen={true}
                            keyExtractor={item => String(item.id)}
                        />
                    ) : (
                        <NoRecordFound iconName="receipt" />
                    )}

                    <ShowMore List={locationAllocationList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
                </View>
            </Refresh>

        </Layout>
    )
}
export default LocationAllocation;



