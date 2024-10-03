import React, { useEffect, useState } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import Layout from "../../components/Layout";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Refresh from "../../components/Refresh";
import { FlatList, Text, Image } from "react-native";
import NoProduct from "../../assets/NoProduct.png";
import PublicRouteService from "../../services/PublicRouteService";
import Spinner from "../../components/Spinner";
import ArrayList from "../../lib/ArrayList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import ImageCarousel from "./components/ImageCarousel";
import PublicPageBlockService from "../../services/PublicPageBlockService";
import { Color } from "../../helper/Color";
import AddButton from "../../components/AddButton";
import styles from "../../helper/Styles";

const Dashboard = (props) => {
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageBlockList, setImageBlockList] = useState([]);

  const navigator = useNavigation();

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    getCategoryList();
    getPageBlockList();
  }, [isFocused, refreshing]);

  const getCategoryList = () => {
    setIsLoading(true);
    PublicRouteService.getCategories({}, (err, response) => {
      if (response && response.data && response.data.data) {
        setCategoryList(response.data.data);
      }
      setIsLoading(false);
    });
  };

  const getPageBlockList = async () => {
    setIsLoading(true);
    await PublicPageBlockService.get((data) => {
      setImageBlockList(data);
      setIsLoading(false);
    });
  };

  const onProfileHandle = async () => {
    const userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);
    if (userId) {
      navigator.navigate("MyAccount");
    } else {
      navigator.navigate("Login");
    }
  };

  const ListItem = ({ item, index }) => {
    let cunkedArray = ArrayList.chunkArray(categoryList, 4);

    let lastCardWidth =
      index == cunkedArray.length - 1
        ? cunkedArray[index].length == 1
          ? width * 0.25
          : cunkedArray[index].length == 2
          ? width * 0.5
          : cunkedArray[index].length == 3
          ? width * 0.73
          : width * 0.97
        : width * 0.97;

    return (
      <View
      style={[styles.listItemContainer, { width: lastCardWidth }]}
    >
        {item &&
          item.length > 0 &&
          item.map((data) => (
            <TouchableOpacity
              key={data.id}
              onPress={() =>
                navigator.navigate("HomeProductList", {
                  categoryId: data.id,
                  name: data.name,
                })
              }
            >
              <ProductCard item={data} />
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const ProductCard = ({ item }) => {
    return (
      <View
        style={styles.productCardContainers}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
          />
        ) : (
          <Image
            source={NoProduct}
            style={styles.productImage}
          />
        )}

        <Text
          numberOfLines={2}
          style={styles.productName}
        >
          {item.name}
        </Text>
      </View>
    );
  };
  return (
    <Layout
      showLogo
      showBackIcon={false}
      showProfile
      onProfileHandle={onProfileHandle}
      isLoading={isLoading}
      hideContentPadding
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        {imageBlockList && imageBlockList.length > 0 && (
          <ImageCarousel imageBlockList={imageBlockList} />
        )}
           <AddButton
              color={Color.GREEN}
                label="Jobs"
                onPress={() => {
                  navigator.navigate("jobSelector");
                }}
                style={styles.addButton}
              />

        <Text style={styles.categoryText}>
          Shop by Category
        </Text>

        {ArrayList.isNotEmpty(categoryList) &&
          ArrayList.chunkArray(categoryList, 4).map((data, index) => {
            return <ListItem item={data} index={index} />;
          })}

        {isFetching && <Spinner />}
      </Refresh>
    </Layout>
  );
};


 
export default Dashboard;
