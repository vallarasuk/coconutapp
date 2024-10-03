// Import React and Component
import React, { useState, useEffect, useRef } from "react";
import { View, Keyboard, Text, Button, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Refresh from "../../../components/Refresh";
import ShowMore from "../../../components/ShowMore";
import styles from "../../../helper/Styles";
import ProductCard from "../../../components/ProductCard";
import NoRecordFound from "../../../components/NoRecordFound";
import ReplenishService from "../../../services/ReplenishService";
import Spinner from "../../../components/Spinner";
import { SwipeListView } from "react-native-swipe-list-view";
import tab from "../../../helper/Tab";
import { Color } from "../../../helper/Color";
import FilterDrawer from "../../../components/Filter";
import Replenishemnt from "../../../helper/Replenishment";

const PendingList = ({
  onReplenishHandler,
  isOpenFilter,
  setIsOpenFilter,
  manageOthersPermission,
  setValues,
  values,
  replenishPendingList,
  setPendingList,
  handleSubmit,
  closeAndOpenFilterDrawer
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(2);
  const [HasMore, setHasMore] = useState(true);
  const isFocused = useIsFocused();

  const { height: screenHeight } = Dimensions.get("window");

  

  const replenishList = async () => {
    try {
      setIsFetching(true);
      await ReplenishService.search({ page: page }, (err, response) => {
        let orders = response && response?.data && response?.data?.data;

        // Set response in state
        setPendingList((prevTitles) => {
          return [...new Set([...prevTitles, ...orders])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(orders.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };


  const statusOnSelect = (value) => {
    if (value) {
      setValues((prevValues) => ({
        ...prevValues,
        status: value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        status: "",
      }));
    }
  };

  const onInputStatusChange = (value) => {
    if (value) {
      setValues((prevValues) => ({
        ...prevValues,
        status: value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        status: "",
      }));
    }
  };

  const renderItem = (data) => {
    let item = data?.item;
    return (
      <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              flex: 1,
            }}
          >
            {item && (
              <>
                <ProductCard
                  size={item.size}
                  unit={item.unit}
                  name={item.name}
                  image={item.image}
                  brand={item.brand}
                  sale_price={item.sale_price}
                  mrp={item.mrp}
                  id={item.id}
                  item={item}
                  noIcon
                  ownerName={manageOthersPermission ? item?.ownerName : ""}
                  onPress={() =>
                    onReplenishHandler({
                      data: item && item && item.barcode,
                      activeTab: tab.REPLENISHED,
                    })
                  }
                />
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const statusList = [
    {
      value: Replenishemnt.STATUS_PENDING,
      label: Replenishemnt.STATUS_PENDING_TEXT,
    },
    {
      value: Replenishemnt.STATUS_COMPLETED,
      label: Replenishemnt.STATUS_COMPLETED_TEXT,
    },
  ];



  return (
    <>
      <FilterDrawer
        values={values}
        isOpen={isOpenFilter}
        closeDrawer={closeAndOpenFilterDrawer}
        statusOnSelect={statusOnSelect}
        onInputStatusChange={onInputStatusChange}
        showStatus
        statusList={statusList}
        handleSubmit={handleSubmit}
        clearFilter={() => {
          setValues("");
          getList();
          closeAndOpenFilterDrawer();
        }}
      />
      <View
        style={
          replenishPendingList && replenishPendingList.length > 0
            ? { flex: 0.8 }
            : { flex: 0.8, justifyContent: "center", alignItems: "center" }
        }
      >
        {replenishPendingList && replenishPendingList.length > 0 ? (
          <SwipeListView
            data={replenishPendingList}
            renderItem={renderItem}
            disableRightSwipe={true}
            closeOnRowOpen={true}
            keyExtractor={(item) => String(item.product_id)}
          />
        ) : replenishPendingList && replenishPendingList.length == 0 ? (
          <View
            style={{
              height: screenHeight * 0.7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <NoRecordFound
                styles={{ alignItems: "center" }}
                iconName="box-open"
              />
            )}
          </View>
        ) : (
          <View
            style={{
              height: screenHeight * 0.7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </View>
        )}
      </View>
      <ShowMore
        List={replenishPendingList}
        isFetching={isFetching}
        HasMore={HasMore}
        onPress={replenishList}
      />
    </>
  );
};

export default PendingList;
