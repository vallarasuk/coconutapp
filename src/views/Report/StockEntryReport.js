import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { View } from "react-native";
import UserCard from "../../components/UserCard";
import DateTime from "../../lib/DateTime";
import AlternativeColor from "../../components/AlternativeBackground";
import DateText from "../../components/DateText";
import styles from "../../helper/Styles";
import Label from "../../components/Label";
import FilterDrawer from "../../components/Filter";
import userService from "../../services/UserService";
import { useIsFocused } from "@react-navigation/native";
import Refresh from "../../components/Refresh";
import NoRecordFound from "../../components/NoRecordFound";
import ShowMore from "../../components/ShowMore";
import stockEntryReportService from "../../services/StockEntryReportService";
import storeService from "../../services/StoreService";
import StoreText from "../../components/StoreText";
import shiftService from "../../services/ShiftService";

const StockEntryReport = () => {

    const [stockEntry, setStockEntry] = useState([])
    const [values, setValues] = useState({
        startDate: new Date(),
        endDate: new Date()
    })
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [userList, setUserList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [HasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    const [locationList, setLocationList] = useState([]);
    const [shiftList, setShiftList] = useState();






    const isFocused = useIsFocused();



    useEffect(() => {
        if(refreshing){
            stockEntryReport(values);
        }
    }, [refreshing]);


    useEffect(() => {
        stockEntryReport(values);
        getUserList();
        getStoreList();
        getShiftList()
    }, [])

    const getShiftList = () =>{
        let shiftListOption = new Array();

        shiftService.getShiftList({ showAllowedShift: true }, (error, response) => {
            let shiftList = response?.data?.data;
            if (shiftList && shiftList.length > 0) {
                for (let i = 0; i < shiftList.length; i++) {
                    shiftListOption.push({
                        label: shiftList[i].name,
                        value: shiftList[i].id,
                    });
                }
                setShiftList(shiftListOption);
            }
        })
     }
    const stockEntryReport = async (values) => {
        stockEntry && stockEntry.length == 0 && setIsLoading(true);
        let params = {}

        if (values?.user) {
            params.user = values?.user
        }
        if (values?.location) {
            params.location = values.location;
        }

        if (values?.startDate) {
            params.startDate = DateTime.formatDate(values?.startDate);
        }

        if (values?.endDate) {
            params.endDate = DateTime.formatDate(values?.endDate);
        }
        if (values?.shift) {
            params.shift = values.shift;
        }
        await stockEntryReportService.getReport(params, (err, response) => {
            let data = response && response?.data && response?.data?.data;
            setStockEntry(data)
            setIsLoading(false);

        })
    }
    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            let params = { page: page }
            if (values?.location) {
                params.location = values.location;
            }

            if (values?.startDate) {
                params.startDate = DateTime.formatDate(values?.startDate);
            }

            if (values?.endDate) {
                params.endDate = DateTime.formatDate(values?.endDate);
            }
            if (values?.user) {
                params.user = values?.user
            }
            if (values?.shift) {
                params.shift = values?.shift
            }
            stockEntryReportService.getReport(params, (err, response) => {

                let stockEntry = response && response?.data && response?.data?.data;

                // Set response in state
                setStockEntry((prevTitles) => {
                    return [...new Set([...prevTitles, ...stockEntry])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(stockEntry?.length > 0);
                setIsFetching(false);
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };
    const closeDrawer = () => {
        setOpenFilter(!openFilter);
    };
    const handleSubmit = async () => {
        stockEntryReport(values);
        closeDrawer();
    };
    const getUserList = () => {
        userService.list(null, (callback) => { setUserList(callback) });

    }
    const getStoreList = () => {
        storeService.list({},(error, response) => {
            const storeListOption = new Array();
            let storeList = response?.data?.data;
            if (storeList && storeList.length > 0) {
                for (let i = 0; i < storeList.length; i++) {
                    storeListOption.push({
                        label: storeList[i].name,
                        value: storeList[i].id,
                    });
                }

                setLocationList(storeListOption);
            }

        });
    }
    const userOnSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                user: value?.value
            }));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                user: ""
            }));
        }

    }
    const locationOnSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                location: value
            }));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                location: ""
            }));
        }
    };
    const shiftOnChange = (value) => {

        if (value) {
          setValues((prevValues) => ({
            ...prevValues,
            shift: value
          }));
        } else {
          setValues((prevValues) => ({
            ...prevValues,
            shift: ""
          }));
        }
      };

    const onDateSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                startDate: new Date(value)
            }));
            setSelectedDate(new Date(value));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                startDate: ""
            }));
            setSelectedDate("");
        }
    };

    const onEndDateSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                endDate: new Date(value)
            }));
            setSelectedEndDate(new Date(value));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                endDate: ""
            }));
            setSelectedEndDate("");
        }
    };

    return (
        <Layout
            title={"Stock Entry Report"}
            showBackIcon
            showFilter
            onFilterPress={closeDrawer}
            isLoading={isLoading}
            refreshing={refreshing}

        >
            <FilterDrawer
                values={values}
                isOpen={openFilter}
                closeDrawer={closeDrawer}
                userOnSelect={userOnSelect}
                locationOnSelect={locationOnSelect}
                onDateSelect={onDateSelect}
                onEndDateSelect={onEndDateSelect}
                selectedDate={selectedDate}
                selectedEndDate={selectedEndDate}
                handleSubmit={handleSubmit}
                userList={userList}
                locationList={locationList}
                showShift
                shiftList={shiftList}
                shiftOnSelect={shiftOnChange}
                showLocation
                showDate
                showUser
                clearFilter={() => {
                    setValues("");
                    stockEntryReport();
                    closeDrawer();
                }}
            />
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

                <View>
                    {stockEntry && stockEntry.length > 0 ? stockEntry.map((item, index) => {
                        const containerStyle = AlternativeColor.getBackgroundColor(index, { plainText: true })

                        return (
                            <View style={[containerStyle, styles.accounts]}>
                                 <UserCard
                                            firstName={item.first_name}
                                            lastName={item.last_name}
                                            image={item.media_url}
                                        />
                                <View style={styles.direction}>
                                    <View style={{ width: "90%" }}>
                                       
                                        {item.location && (
                                            <StoreText locationName={item.location} style = {styles.alignType}/>

                                        )}
                                    </View>

                                    <View style={{ width: "20%" }}>

                                        <Label text={item.product_count} bold={true} size={17} />
                                    </View>
                                </View>

                                <DateText date={item.date} dateFormat style = {styles.alignType}/>
                            </View>


                        )
                    }) : <NoRecordFound iconName={"receipt"} />}
                    <ShowMore List={stockEntry} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

                </View>
            </Refresh>

        </Layout>


    )

}
export default StockEntryReport;