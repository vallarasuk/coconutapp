import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import UserAvatar from "react-native-user-avatar";
import Layout from "../../components/Layout";
import { Color } from "../../helper/Color";
import ArrayList from "../../lib/ArrayList";
import ReplenishmentReportService from "../../services/ReplenishmentReportService";
import FilterDrawer from "../../components/Filter";
import userService from "../../services/UserService";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../../components/Spinner";
import ShowMore from "../../components/ShowMore";


const ReplenishmentReport = (props) => {
    const [detail, setDetail] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [userList, setUserList] = useState([]);
    const [values, setValues] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [HasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(2);

    let navigation = useNavigation()


    useEffect(() => {
        getDetail();
        getUserList()
    }, []);

    const getDetail = async (values) => {
        setIsLoading(true)
        await ReplenishmentReportService.search({ user: values?.user ? values?.user : "" }, (err, res) => {
            setDetail(res?.data?.data);
            setIsLoading(false)
        });
    };


    const LoadMoreList = async () => {
        try {
          setIsFetching(true);
          await ReplenishmentReportService.search({page: page, user: values?.user ? values?.user : "" }, (err, res) => {
            let data = res?.data?.data
            setDetail((prevTitles) => {
              return [...new Set([...prevTitles, ...data])];
            });
            setPage((prevPageNumber) => prevPageNumber + 1);
            setHasMore(data.length > 0);
            setIsFetching(false);
          })
    
        } catch (err) {
          console.log(err);
          setIsLoading(false);
        }
      };
    const getUserList = () => {
        userService.list(null, (callback) => { setUserList(callback) });

    }

    const renderUser = (media_url, name) => {

        return (
            <View style={{ flexDirection: "row", display: "flex" }}>
                <View>
                    {media_url ? (
                        <Image
                            source={{ uri: media_url }}
                            style={styles.avatarStyle}
                        />
                    ) : (
                        <UserAvatar
                            size={55}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                            name={name}
                            bgColor={Color.AVATAR_BACKGROUND}
                        />
                    )}
                </View>
                <View style={{ width: 100, }}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: "black", marginLeft: 5, marginTop: 10 }}>
                        {name}
                    </Text>
                </View>
            </View>
        )

    }

    const onPendingClick = (user, pendingStatus) => {
        navigation.navigate("ReplenishmentProduct", { user, status: pendingStatus })
    }

    const onCompletedClick = (user, completedStatus) => {
        navigation.navigate("ReplenishmentProduct", { user, status: completedStatus })
    }

    const closeDrawer = () => {
        setOpenFilter(!openFilter);
    }

    const userOnSelect = (value) => {
        if (value) {
            setValues((prevValues) => ({
                ...prevValues,
                user: value.value
            }));
        } else {
            setValues((prevValues) => ({
                ...prevValues,
                user: ""
            }));
        }

    }

    const handleSubmit = () => {
        getDetail(values)
        closeDrawer()
    };


    const renderTable = () => {
        if (isLoading) {
            return <Spinner />
        }

        return (
            <ScrollView horizontal>
                <View style={{ width: "100%" }}>
                    <ScrollView vertical>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, { width: 220 }]}>User</Text>
                                <Text style={[styles.tableHeaderText, { width: 100 }]}>Pending</Text>
                                <Text style={[styles.tableHeaderText, { width: 110 }]}>Completed</Text>
                                <Text style={styles.tableHeaderText}>Product Count</Text>
                            </View>
                            {ArrayList.isArray(detail) && detail.map((row) => (
                                <View key={row.id} style={styles.tableRow}>
                                    <Text style={[styles.tableText, styles.cellPadding, { width: 120 }]}>{renderUser(row?.media_url, row?.ownerName)}</Text>
                                    <Text onPress={() => onPendingClick(row?.ownerId, row?.pendingStatusId)} style={[styles.tableText, { paddingTop: 30, color: "blue" }]}>{row.pendingStatus}</Text>
                                    <Text onPress={() => onCompletedClick(row?.ownerId, row?.completedStatusId)} style={[styles.tableText, { paddingTop: 30, color: "blue" }]}>{row.completedStatus}</Text>
                                    <Text style={[styles.tableText, { paddingTop: 30 }]}>{row.replenishCount}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
            
        )
    }



    return (
        <Layout
            title={"Replenishment Report"}
            showBackIcon
            showFilter={true}
            onFilterPress={closeDrawer}
        >
            <FilterDrawer
                values={values}
                setValues={setValues}
                isOpen={openFilter}
                closeDrawer={closeDrawer}
                userOnSelect={userOnSelect}
                handleSubmit={handleSubmit}
                userList={userList}
                showUser
            />
            {renderTable()}
            <ShowMore List={detail} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

        </Layout>
    );
};

const styles = StyleSheet.create({
    table: {
        flex: 1,
        padding: 10,
        width: "100%",
    },
    tableHeader: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 50,
        backgroundColor: "black",
    },
    tableHeaderText: {
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: "white",
        borderColor: "#ccc",

    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 50,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        textAlignVertical: "center",
    },
    tableText: {
        flex: 1,
        textAlign: "center",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        paddingVertical: 15,
        minHeight: 80,
    },
    cellPadding: {
        paddingHorizontal: 10,
        textAlign: "left",
    },
    avatarStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});

export default ReplenishmentReport;
