
import Layout from "../../../components/Layout";

import React, { useState, useEffect } from "react";

import Filter from "../components/BulkOrderFilter";

import { View } from "react-native";

import SearchBar from "../../../components/SearchBar";

import categoryService from "../../../services/CategoryService";

import ProductCard from "../../../components/ProductCard";

import productService from "../../../services/ProductService";

import { SwipeListView } from "react-native-swipe-list-view";

import CategoryDrawer from "../components/CategoryDrawer";

import Button from "../../../components/Button";

import { Color } from "../../../helper/Color";

import QuantityButton from "../../../components/Quantity/index";

import brandService from "../../../services/BrandService";

import ArrayList from "../../../lib/ArrayList";

import BulkOrderService from "../../../services/BulkOrderService";

import Cart from "../../../components/Cart";

import { useNavigation } from "@react-navigation/native";
import NoRecordFound from "../../../components/NoRecordFound";

import { useIsFocused } from "@react-navigation/native";

const BulkOrder = (props) => {

    const params = props?.route?.params;

    const [productList, setProductList] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [categoryList, setCategoryList] = useState([]);

    const [brandList, setBrandList] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState([]);

    const [openCategoryDrawer, setCategoryDrawer] = useState(false);

    const [searchPhrase, setSearchPhrase] = useState("");

    const [clicked, setClicked] = useState(false);

    const [addedProducts, setAddedProducts] = useState([]);

    const [orderId, setOrderId] = useState("");

    const isFocused = useIsFocused();

    const navigation = useNavigation();

    useEffect(() => {
        getFilterList();
        getProductList();
    }, [props, isFocused]);

    const getFilterList = () => {
        categoryService.getCategoryList(setCategoryList);
        brandService.getBrandList(setBrandList);
    }

    const getProductList = async (searchTerm, categories, brands) => {
        if (!searchTerm) {
            setIsLoading(true);
        }
        let response = await productService.SearchProductFromSQLite(searchTerm, categories, brands);

        if (ArrayList.isNotEmpty(response) && orderId) {
            let orderProductList = await BulkOrderService.getProductList(orderId);
            let indexValue;
            if (orderProductList && orderProductList.length > 0) {
                for (let i = 0; i < orderProductList.length; i++) {
                    indexValue = response.findIndex((data) => data.product_id == orderProductList[i].product_id);

                    if (indexValue > -1) {
                        response[indexValue].quantity = orderProductList[i].quantity;
                        response[indexValue].orderProductId = orderProductList[i].id;
                    }
                }
                setAddedProducts(orderProductList);
            } else {
                setAddedProducts([]);
            }
        }
        setProductList(response);
        if (!searchTerm) {
            setIsLoading(false);
        }
    }

    const onCategorySelect = (selectedFilter) => {

        let categoryFilters;

        if (selectedFilter && selectedCategory.length > 0) {

            categoryFilters = selectedCategory;

            let categoryIndex = categoryFilters.findIndex((data) => data == selectedFilter.value);

            if (categoryIndex > -1) {
                categoryFilters.splice(categoryIndex, 1);
            } else {
                categoryFilters.push(selectedFilter.value);
            }

            setSelectedCategory([...categoryFilters]);

        } else {
            categoryFilters = new Array();

            categoryFilters.push(selectedFilter.value);

            setSelectedCategory(categoryFilters);

        }
        getProductList(searchPhrase, categoryFilters);
    }

    const onProductAdd = async (item) => {

        if (item) {

            let orderProductId;
            let addedItem = addedProducts;
            let customerId = params && params.customerDetail && params.customerDetail.id;
            let customerPhoneNumber = params && params.customerDetail && params.customerDetail.mobile_number;

            if (!orderId) {

                let orderId = await BulkOrderService.createOrder(customerId, customerPhoneNumber);

                if (orderId) {
                    setOrderId(orderId);
                    orderProductId = await BulkOrderService.createOrderProduct(
                        {
                            localOrderId: orderId,
                            product_id: item.product_id,
                            quantity: 1,
                            sale_price: item.sale_price,
                            cost_price: item.cost,
                            mrp: item.mrp,
                        })

                    if (orderProductId) {
                        BulkOrderService.updateTotalAmount(orderId);
                    }
                }
            } else {
                orderProductId = await BulkOrderService.createOrderProduct(
                    {
                        localOrderId: orderId,
                        product_id: item.product_id,
                        quantity: 1,
                        sale_price: item.sale_price,
                        cost_price: item.cost,
                        mrp: item.mrp,
                        customer_phone_number: customerPhoneNumber
                    })

                if (orderProductId) {
                    BulkOrderService.updateTotalAmount(orderId);
                }
            }

            item.quantity = 1;
            item.orderProductId = orderProductId;
            addedItem.push(item);
            setAddedProducts([...addedItem]);
        }
    }

    const onQuantityOnChange = async (item, quantity) => {

        if (item && ArrayList.isNotEmpty(addedProducts)) {

            let addedItem = addedProducts;

            let index = addedItem.findIndex((data) => data.product_id == item.product_id);

            if (index > -1) {
                addedItem[index].quantity = quantity


                setAddedProducts([...addedItem]);

                await BulkOrderService.updateOrderProduct(item.orderProductId, quantity);

                await BulkOrderService.updateTotalAmount(orderId)

            }
        }
    }

    const onCardPress = () => {
        navigation.navigate("BulkOrderCart", { orderId })
    }

    const ListItem = React.memo(function ListItem({ item }) {
        return (
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 0.7 }}>
                    {item && (
                        <>
                            <ProductCard
                                size={item.size}
                                unit={item.unit}
                                name={item.product_name}
                                image={item.featured_media_url}
                                brand={item.brand_name}
                                sale_price={item.sale_price}
                                mrp={item.mrp}
                                id={item.id}
                                item={item}
                                quantity={item.quantity}
                                editable
                                noIcon
                            />
                        </>
                    )}
                </View>
                <View style={{ flex: 0.35, justifyContent: "center" }}>

                    {item.quantity >= 0 ? (
                        <QuantityButton
                            quantity={item.quantity}
                            styleTextInput={{ width: 50, height: 50, marginTop: 3 }}
                            quantityOnChange={(quantity) => onQuantityOnChange(item, quantity)}
                        />
                    ) : (
                        <Button title={"Add"} backgroundColor={Color.PRIMARY} onPress={() => onProductAdd(item)} />

                    )}

                </View>
            </View>);
    });

    return (

        <Layout
            title={"Bulk Order"}
            isLoading={isLoading}
            showBackIcon={true}
            showFilter={true}
            onFilterPress={() => setCategoryDrawer(true)}
        >

            {openCategoryDrawer && (
                <CategoryDrawer
                    isOpen={openCategoryDrawer}
                    onClose={() => setCategoryDrawer(false)}
                    categoryList={categoryList}
                    brandList={brandList}
                    selectedCategory={selectedCategory}
                    selectedBrand={selectedBrand}
                    searchTerm={searchPhrase}
                    onApplyFilter={getProductList}
                    setSelectedCategoryFilter={setSelectedCategory}
                    setSelectedBrandFilter={setSelectedBrand}
                />
            )}

            <View style={{ width: "85%" }}>
                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    clicked={clicked}
                    onPress={() => getProductList(null, selectedCategory, selectedBrand)}
                    handleChange={(search) => getProductList(search, selectedCategory, selectedBrand)}
                    noScanner
                />
            </View>

            <Cart itemCount={addedProducts.length} onCardPress={onCardPress} />

            <Filter
                onCategorySelect={onCategorySelect}
                categoryList={categoryList}
                selectedCategory={selectedCategory}
            />

            {ArrayList.isNotEmpty(productList) ? (
                <SwipeListView
                    data={productList}
                    renderItem={(data) => (<ListItem item={data?.item} />)}
                    renderHiddenItem={() => <></>}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    closeOnRowOpen={true}
                    keyExtractor={(item) => String(item.product_id)}
                    disableRightSwipe={true}
                />
            ) : (
                <NoRecordFound iconName={"receipt"} message={"No Records Found"} />
            )}

        </Layout>
    )


}

export default BulkOrder;