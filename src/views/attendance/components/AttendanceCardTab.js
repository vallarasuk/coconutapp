import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import NoRecordFound from "../../../components/NoRecordFound";
import ShowMore from "../../../components/ShowMore";
import ArrayList from "../../../lib/ArrayList";
import String from "../../../lib/String";
import AttendanceService from "../../../services/AttendanceService";
import Spinner from "../../../components/Spinner";
import Layout from "../../../components/Layout";
import Refresh from "../../../components/Refresh";
import AlternativeColor from "../../../components/AlternativeBackground";
import { TouchableOpacity } from "react-native";
import styles from "../../../helper/Styles";

const AttendanceCardTab = (props) => {
  const {
    refreshing,
    setRefreshing,
    isListFeatching,
    values,
    closeDrawer,
    setIsListFeatching,
  } = props;
  const [attendanceMonthRecord, setAttendanceMonthRecord] = useState([]);
  const [HasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    getAttendanceMonthRecordList(values);
  }, [isFocused, refreshing, isListFeatching]);
  const getAttendanceMonthRecordList = async (values) => {
    try {
      setIsLoading(true);
      await AttendanceService.getMonthRecord(
        { page: page, user: values?.user ? values?.user : "" },
        (res) => {
          if (res) {
            setAttendanceMonthRecord(res);
            setPage(1);
            setIsListFeatching(false);
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    } finally {
      setRefreshing(false);
      setIsListFeatching(false);
    }
  };

  const LoadMoreList = async (values) => {
    try {
      setIsFetching(true);

      let params = { page: page, user: values?.user ? values?.user : "" };

      await AttendanceService.getMonthRecord(params, (res) => {
        setAttendanceMonthRecord((prevTitles) => {
          return [...new Set([...prevTitles, ...res])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(res.length > 0);
        setIsFetching(false);
        setIsListFeatching(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = (data) => {
    const item = data?.item;
    const index = data?.index;

    const containerStyle = AlternativeColor.getBackgroundColor(index);

    return (
      <TouchableOpacity style={[styles.listContainer, containerStyle]}>
        <View>
          <View style={style.centeredContent}>
            <Text style={style.boldText}>
              {String.reduceSpaces(item?.month_year)}
            </Text>
          </View>
          <View style={style.row}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[style.boldText, { marginRight: 20 }]}>
                  Working Day
                </Text>
                <Text style={style.normalText}>
                  <Text style={style.boldText}>:</Text>{" "}
                  {item?.working_day_count}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={[style.boldText, { marginRight: 7 }]}>
                  Additional Day
                </Text>
                <Text style={style.normalText}>
                  <Text style={style.boldText}>:</Text>{" "}
                  {item?.additional_day_count}
                </Text>
              </View>
            </View>
            <View style={[style.badgeContainer, { alignSelf: "flex-end" }]}>
              <View style={style.badge}>
                <Text style={style.badgeText}>{item?.total_days_count}</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", marginRight: 10 }}>
              <Text style={[style.boldText, { marginRight: 35 }]}>
                Over Time
              </Text>
              <Text style={style.normalText}>
                <Text style={style.boldText}>:</Text>{" "}
                {item?.total_additional_hours}
              </Text>
            </View>
            <Text style={[style.normalText, { marginTop: 3 }]}>
              ({item?.over_time_days ? item?.over_time_days : 0}{" "}
              {item?.over_time_days > 1 ? "days" : "day"})
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[style.boldText, { marginRight: 65 }]}>Leave</Text>
            <Text style={style.normalText}>
              <Text style={style.boldText}>:</Text> {item?.leave_count}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Layout
      title={"Attendance Report (Month Wise)"}
      isLoading={isLoading}
      refreshing={refreshing}
      showFilter={true}
      onFilterPress={closeDrawer}
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        {ArrayList.isArray(attendanceMonthRecord) &&
        attendanceMonthRecord.length > 0 ? (
          <SwipeListView
            data={attendanceMonthRecord}
            renderItem={renderItem}
            rightOpenValue={-70}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            disableRightSwipe
            closeOnRowOpen
            keyExtractor={(item) => item?.month_year}
          />
        ) : (
          <NoRecordFound iconName="receipt" />
        )}
        <ShowMore
          List={attendanceMonthRecord}
          isFetching={isFetching}
          HasMore={HasMore}
          onPress={() => LoadMoreList(values)}
        />
      </Refresh>
    </Layout>
  );
};

const style = StyleSheet.create({
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  normalText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  boldText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  card: {
    marginVertical: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#6200ee",
    borderRadius: 23,
    minHeight: 47,
    minWidth: 47,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
  badgeContainer: {
    marginLeft: 150,
  },
});

export default AttendanceCardTab;
