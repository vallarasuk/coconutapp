import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import accountService from "../../services/AccountService";
import { View, ScrollView } from "react-native";
import AlternativeColor from "../../components/AlternativeBackground";
import styles from "../../helper/Styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AccountCard from "../Accounts/Components/AccountCard";
import SearchBar from "../../components/SearchBar";
import Status from "../../helper/Status";
import { Account } from "../../helper/Account";
import ShowMore from "../../components/ShowMore";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";

const CustomerSelector = (props) => {
  const params = props?.route?.params;

  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(2);
  const [HasMore, setHasMore] = useState(true);
  const [showCustomerAdd, setShowCusomerAdd] = useState(false);
  const [isOnpress, setIsOnpress] = useState(false)
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  useEffect(() => {
    getAccountList();
    getPermission();
  }, [refreshing, isFocused]);

  const getAccountList = async () => {
    searchPhrase == "" && !refreshing && setIsLoading(true);
    await accountService.search({ status: Status.ACTIVE, accountCategory: Account.TYPE_CUSTOMER }, (error, response) => {
      if (response && response.data && response.data.data) {
        setCustomerList(response.data.data);
      }
      setIsLoading(false)
    });
  };

  const getPermission = async () => {
    const addCustomer = await PermissionService.hasPermission(
      Permission.CUSTOMER_ADD
    );
    setShowCusomerAdd(addCustomer);
  }

  const AddCustomer = () => {
    navigation.navigate("CustomerAdd", {
      reDirectUrl: params.reDirectUrl,
      onSelectCustomer: params.onSelectCustomer
    })
  }

  const handleChange = async (search) => {
    setSearchParam(search)
    let params
    params = { status: Status.ACTIVE, accountCategory: Account.TYPE_CUSTOMER, search: search ? search : "" }
    accountService.search(params, (error, response) => {
      setCustomerList(response && response.data && response.data.data)
      if (searchPhrase.length == 0) {
        getAccountList;
      }
    })
  };

  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = { page: page, search: searchParam ? searchParam : "", status: Status.ACTIVE, accountCategory: Account.TYPE_CUSTOMER }

      accountService.search(params, (err, response) => {

        let accounts = response && response?.data && response?.data?.data

        // Set response in state
        setCustomerList((prevTitles) => {
          return [...new Set([...prevTitles, ...accounts])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(accounts?.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const onSelectCustomer = (customer) => {
    if (params.reDirectUrl) {
      navigation.navigate(params.reDirectUrl, {
        customerDetail: customer
      })
    } else {
      params.onSelectCustomer && params.onSelectCustomer(customer);
    }
  }

  return (
    <Layout
      title={"Select Customer"}
      addButton={showCustomerAdd ? true : false}
      buttonOnPress={showCustomerAdd ? AddCustomer : ""}
      isLoading={isLoading}
      refreshing={refreshing}
    >
      <View style={{ flex: 1 }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}>
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setClicked={setClicked}
            clicked={clicked}
            setSearch={setSearch}
            onPress={getAccountList}
            handleChange={handleChange}
            noScanner
          />

        </View>

        <ScrollView style={{ marginTop: 60 }}>
          <View style={styles.container}>
            {customerList && customerList.length > 0 &&
              customerList.map((customer, index) => {
                const containerStyle = AlternativeColor.getBackgroundColor(index);
                return (
                  <AccountCard
                    key={customer?.id}
                    id={customer?.id}
                    accountName={customer.vendorName}
                    mobileNumber={customer.mobile_number}
                    alternative={containerStyle}
                    onPress={(e) => { onSelectCustomer(customer), setIsOnpress(true) }}
                    isOnpress={isOnpress}
                    showIcon
                  />
                );
              })}

            <ShowMore List={customerList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};


export default CustomerSelector;
