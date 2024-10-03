// Import React and Component
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { Color } from "../../helper/Color";
import ProductCard from "../../components/ProductCard";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import WishListService from "../../services/WishListService";
import DateTime from "../../lib/DateTime";
import { SwipeListView } from "react-native-swipe-list-view";
import DeleteModal from "../../components/Modal/DeleteModal";
import Permission from "../../helper/Permission";
import Label from "../../components/Label";
import Refresh from "../../components/Refresh";
import PermissionService from "../../services/PermissionService";
import styles from "../../helper/Styles";

const WishListProducts = (props) => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [addPermission, setAddPermission] = useState(false);
  const [search, setSearch] = useState(false);

  const isFocused = useIsFocused();
  const stateRef = useRef();
  const navigation = useNavigation();

  // Render the stock entry list function
  useEffect(() => {
    let mount = true;
    if (mount) {
      getProductsList({ search: searchPhrase });
      getPermission();
    }

    // Cleanup function
    return () => {
      mount = false;
    };
  }, [isFocused]);

  useEffect(() => {
    if (refreshing) {
      getProductsList({ search: searchPhrase });
    }
  }, [refreshing]);

  // Get Product List
  const getProductsList = async (values) => {
    try {
      productList && productList.length === 0 && setIsLoading(true);
      WishListService.getProductList(values, (error, response) => {
        if (response && response.length > 0) {
          setProductList(response);
        } else {
          setProductList([]); // Ensure that the list is set to empty if no results found
        }
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const onSelectStore = (selectedStore) => {
    if (selectedStore) {
      navigation.navigate("ProductAdd", {
        storeId: selectedStore?.id,
      });
    }
  };

  const AddNew = () => {
    navigation.navigate("StoreSelector", {
      onSelectStore: onSelectStore,
    });
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const clearRowDetail = () => {
    if (stateRef) {
      const selectedItem = stateRef.selectedItem;
      const selectedRowMap = stateRef.selectedRowMap;
      if (selectedItem && selectedRowMap) {
        closeRow(selectedRowMap, selectedItem.id);
        setSelectedItem("");
        stateRef.selectedItem = "";
        stateRef.selectedRowMap = "";
      }
    }
  };

  const productDeleteModalToggle = () => {
    setProductDeleteModalOpen(!productDeleteModalOpen);
    clearRowDetail();
  };

  const handleChange = async (search) => {
    setSearchPhrase(search);
    getProductsList({ search: search });
  };

  const deleteWishListProduct = async () => {
    if (selectedItem) {
      WishListService.deleteWishListProduct(selectedItem.id, (error, response) => {
        getProductsList({ search: searchPhrase }); // Refresh the list after deletion
      });
    }
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.swipeStyle}>
        <TouchableOpacity
          style={[styles.actionDeleteButton]}
          onPress={() => {
            productDeleteModalToggle();
            setSelectedItem(data?.item);
            stateRef.selectedItem = data?.item;
            stateRef.selectedRowMap = rowMap;
            closeRow(rowMap, data?.item.id);
          }}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = (data) => {
    let item = data?.item;
    return (
      <View style={styles.container}>
        <View>
          {item && (
            <>
              <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                <View style={{ flex: 0.5, flexDirection: "row" }}>
                  <Text style={{ color: "grey" }} numberOfLines={1}>
                    {DateTime.formattedfDate(new Date(item.date), "DD-MMM-YY")}
                  </Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: "row" }}>
                  <Text style={{ color: "grey" }} numberOfLines={1}>
                    {item.store_name}
                  </Text>
                </View>
              </View>
              <ProductCard
                unit={item.unit}
                name={item.product_name}
                image={item.image}
                brand={item.brand_name}
                id={item.id}
                sale_price={item.sale_price}
                mrp={item.mrp}
                noIcon
              />
            </>
          )}
        </View>
      </View>
    );
  };

  const getPermission = async () => {
    let manageOther = await PermissionService.hasPermission(Permission.WISHLIST_ADD);
    setAddPermission(manageOther);
  };

  return (
    <Layout
      title={"Wishlist"}
      addButton={addPermission}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      refreshing={refreshing}
      showBackIcon={false}
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        <View style={styles.searchBar}>
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setClicked={setClicked}
            clicked={clicked}
            setSearch={setSearch}
            onPress={getProductsList}
            handleChange={handleChange}
            noScanner
          />
        </View>

        <DeleteModal
          modalVisible={productDeleteModalOpen}
          toggle={productDeleteModalToggle}
          item={selectedItem}
          updateAction={deleteWishListProduct}
        />

        <View style={styles.container}>
          {productList && productList.length > 0 ? (
            <SwipeListView
              data={productList}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-70}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              disableRightSwipe={true}
              closeOnRowOpen={true}
              keyExtractor={(item) => String(item.id)}
            />
          ) : (
            <View style={{ paddingVertical: 250, alignItems: "center" }}>
              <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
              <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
            </View>
          )}
        </View>
      </Refresh>
    </Layout>
  );
};

export default WishListProducts;
