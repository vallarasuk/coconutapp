// Import React and Component
import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    RefreshControl,
    ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

// Spinner
import Spinner from "../../components/Spinner";

import Select from "../../components/Select";

import Layout from "../../components/Layout";

import StoreService from "../../services/StoreService";

import { useIsFocused } from "@react-navigation/native";

import { Color } from "../../helper/Color";

import ActionBarButton from "../../components/ActionBarButton";

import ProductService from "../../services/ProductService";

import WishListService from "../../services/WishListService";
import { useForm } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import ProductSearch from "../../components/ProductSearch";
import OnePortalDB from "../../lib/SQLLiteDB";
import FuseSearch from "../../helper/FuseSearch";
import { FontAwesome5 } from "@expo/vector-icons";
import dateTime from "../../lib/DateTime";
import { ErrorMessage } from "../../helper/ErrorMessage";

import { endpoints } from "../../helper/ApiEndPoint";
import brandService from "../../services/BrandService";
import categoryService from "../../services/CategoryService";
import LoadMoreButton from "../../components/LoadMoreButton";
import ShowMore from "../../components/ShowMore";


const StoreSelectionScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [storeId, setStoreId] = useState("");
    const [productId, setProductId] = useState("");
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [productList, setproductList] = useState([]);
    const [searchedProduct, setSearchedProduct] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [storeProductList, setStoreProductList] = useState([]);
    const [search, setSearch] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [brandList, setBrandList] = useState();
    const [categoryList, setCategoryList] = useState();
    const [categoryValue, setcategoryValue] = useState();
    const [brandValue, setBrandValue] = useState();
    const [searchValue, setSearchValue] = useState();
    const [page, setPage] = useState(1);
    const [HasMore, setHasMore] = useState(true);



    const isFocused = useIsFocused();

    const navigation = useNavigation();

    const wait = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    // render the inventory list function
    useEffect(() => {
        getBrandList();
        getProductList();
        getCategoryList();
    }, [isFocused]);

    let params = props?.route?.params;
    const {
        control,
        formState: { errors },
    } = useForm();


    const getBrandList = () => {
        brandService.getBrandList((response) => {
            const brandListOption = new Array();

            let brandList = response;
            if (brandList && brandList.length > 0) {
                for (let i = 0; i < brandList.length; i++) {
                    brandListOption.push({
                        label: brandList[i].label,
                        value: brandList[i].value,
                    }); 0
                }

                setBrandList(brandListOption);
            }

        });
    }

    const getCategoryList = () => {
        categoryService.getCategoryList((response) => {
            const categoryListOption = new Array();

            let categoryList = response;
            if (categoryList && categoryList.length > 0) {
                for (let i = 0; i < categoryList.length; i++) {
                    categoryListOption.push({
                        label: categoryList[i].label,
                        value: categoryList[i].value,
                    }); 0
                }

                setCategoryList(categoryListOption);
            }

        });
    }

    const handleSearchOnChange = async (search) => {
        setSearchValue(search)
        //Api Call
        try {
            ProductService.search(null, { brand: brandValue ? brandValue : "", category: categoryValue ? categoryValue : "", search : search ? search : ""}, (error, response) => {
                console.log(response);
                let productList = new Array();
                if (response && response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        productList.push(
                            {
                                label: response[i].product_display_name,
                                value: response[i].id,
                                image: response[i].image,
                                brand: response[i].brand,
                                sale_price: response[i].sale_price,
                                mrp: response[i].mrp
                            }
                        )
                    }
                    setproductList(productList);
                }
                setIsLoading(false);
            })
        } catch (err) {
            console.log(err);
        }


    };
    const handleCategory = async (category) => {
        setcategoryValue(category)
        try {
            ProductService.search(null, { brand: brandValue ? brandValue : "", category: category ? category : ""}, (error, response) => {
                let productList = new Array();
                if (response && response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        productList.push(
                            {
                                label: response[i].product_display_name,
                                value: response[i].id,
                                image: response[i].image,
                                brand: response[i].brand,
                                sale_price: response[i].sale_price,
                                mrp: response[i].mrp
                            }
                        )
                    }
                    setproductList(productList);
                }
                setIsLoading(false);
            })
        } catch (err) {
            console.log(err);
        }

    };
    const handleBrand = async (brand) => {
        setBrandValue(brand)
        try {
            ProductService.search(null, {brand: brand ? brand : "", category: categoryValue ? categoryValue : ""}, (error, response) => {
                let productList = new Array();
                if (response && response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        productList.push(
                            {
                                label: response[i].product_display_name,
                                value: response[i].id,
                                image: response[i].image,
                                brand: response[i].brand,
                                sale_price: response[i].sale_price,
                                mrp: response[i].mrp
                            }
                        )
                    }
                    setproductList(productList);
                }
                setIsLoading(false);
            })
        } catch (err) {
            console.log(err);
        }

    };
    

    const getProductList = (params) => {
        try {
            setIsLoading(true);
            ProductService.search(null, params, (error, response) => {
                let productList = new Array();
                if (response && response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        productList.push(
                            {
                                label: response[i].product_display_name,
                                value: response[i].id,
                                image: response[i].image,
                                brand: response[i].brand,
                                sale_price: response[i].sale_price,
                                mrp: response[i].mrp
                            }
                        )
                    }
                    setproductList(productList);
                }
                setIsLoading(false);
            })
        } catch (err) {
            console.log(err);
        }
    }

    const LoadMoreList = async () => {
        try {
            setIsLoading(true);
            ProductService.search(null, {page: page}, (error, response) => {
                let productList = new Array();
                if (response && response.length > 0) {
                    for (let i = 0; i < response.length; i++) {
                        productList.push(
                            {
                                label: response[i].product_display_name,
                                value: response[i].id,
                                image: response[i].image,
                                brand: response[i].brand,
                                sale_price: response[i].sale_price,
                                mrp: response[i].mrp
                            }
                        )
                    }
                    setproductList((prevTitles) => {
                        return [...new Set([...prevTitles, ...productList])];
                    });
                    setPage((prevPageNumber) => prevPageNumber + 1);
                    setHasMore(productList.length > 0);
                    setIsLoading(false);
                }
                setIsLoading(false);
            })

        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const addProduct = (product_id) => {
            let bodyData = {
                productId: product_id,
                storeId: params?.storeId,
                date: new Date()
            }

            WishListService.addProduct(bodyData, (error, response) => {
                if (response) {
                    setProductId("");
                    setStoreId("");
                    navigation.navigate("WishListProducts");
                }
            });
    }

    if (isLoading && !refreshing) {
        return <Spinner />;
    }

    /* Render flat list funciton end */
    return (
        <Layout title="Add Product" showBackIcon backButtonNavigationUrl={"WishListProducts"}
        >
            <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
            <View >
                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    clicked={clicked}
                    handleChange={handleSearchOnChange}
                    noScanner
                />
            </View>

            <View style={styles.container1}>
                <View style={styles.brandSelect}>
                    <Select
                        options={brandList}
                        label={"Brand"}
                        OnSelect={handleBrand}
                        placeholder={"Select Brand"}
                        control={control}
                    />
                </View>
                <View style= {styles.category}>
                    <Select
                        options={categoryList}
                        OnSelect={handleCategory}
                        label={"Category"}
                        placeholder={"Select Category"}
                        control={control}
                    />
                </View>
            </View>
            <View style={styles.container}>
                <View style ={styles.productCard}>


                    {(productList && productList.length > 0 &&
                        productList.map((item) => {
                            return (
                                <View 
                                style={styles.containers}>
                                    <View style={styles.container}>

                                            <ProductCard
                                                name={item.label}
                                                size={item.size}
                                                unit={item.unit}
                                                image={item.image}
                                                brand={item.brand_name}
                                                sale_price={item.sale_price}
                                                mrp={item.mrp}
                                                id={item.id}
                                                quantity={item.quantity}
                                                onPress={(()=> {
                                                    addProduct(item?.value)
                                                })}
                                            />
                                    </View>

                                </View>
                            )
                        })
                    )}
                </View>
            </View>
            <ShowMore List={productList} isFetching={isLoading} HasMore={HasMore} onPress={LoadMoreList} />
            </ScrollView>
        </Layout>
    );
};

export default StoreSelectionScreen;

const styles = StyleSheet.create({
    container: {
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    productCard :{
     marginTop: 10, padding: 10,
    },
    brandSelect : {
         width: "50%" 
    },
    category : {
        width: "48%", paddingLeft: 3
    },
    containers: {
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
    container1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      },
});
