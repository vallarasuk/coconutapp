// Import React and Component
import React, { useEffect, useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//Footer and Header
import Layout from "../../components/Layout";

import SearchBar from "../../components/SearchBar";

import ProductSelectModal from "../../components/Modal/ProductSelectModal";

import ConfirmationModal from "../../components/Modal/ConfirmationModal";

import BarcodeScanner from "../../components/BarcodeScanner";

import AlertMessage from "../../helper/AlertMessage";

import Refresh from "../../components/Refresh";

import productService from "../../services/ProductService";

import ProductCard from "../../components/ProductCard";

import StoreProductService from "../../services/StoreProductService";

import ArrayList from "../../lib/ArrayList";

import { Card, Title } from 'react-native-paper';

import AddTransferModal from "./components/AddTransferModal";

import InventoryTransferService from "../../services/InventoryTransferService";

import StoreQuantityEditModal from "./components/StoreQuantityEditModal";

import { useForm } from "react-hook-form";


import { Color } from "../../helper/Color";


import SyncService from "../../services/SyncService";

import Button from "../../components/Button";

import { List } from 'react-native-paper';

import { SwipeListView } from "react-native-swipe-list-view";

import Checkbox from '../../components/CheckBox';
import SelectedFilter from "../../components/SelectedFilter";
import Spinner from "../../components/Spinner";
import Permission from "../../helper/Permission";
import Replenishment from "../../helper/Replenishment";
import PermissionService from "../../services/PermissionService";
import PendingList from "./components/list";
import ReplenishService from "../../services/ReplenishService";
import { useIsFocused } from "@react-navigation/native";

const Replenish = (props) => {

    let params = props?.route?.params;
    const [listVisible, setListVisible] = useState(true);
    const [modelVisible, setModelVisible] = useState(false);

    //state
    const [productList, setProductList] = useState("");

    const [refreshing, setRefreshing] = useState(false);
    //search
    const [searchPhrase, setSearchPhrase] = useState("");

    const [clicked, setClicked] = useState(false);

    const [modalVisible, setScanModalVisible] = useState(false);

    const [scannedCode, setScannedCode] = useState("");

    const [productNotFoundModalOpen, setProductNotFoundModalOpen] = useState(false);

    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

    const [searchParam, setSearchParam] = useState("");

    const [selectedProduct, setSelectedProduct] = useState("");

    const [replenishResponse, setReplenishStoreResponse] = useState("");
   
    const [openQuantitySelectModal, setQuantitySelectModal] = useState(false);

    const [selectedQuantity, setSelectedQuantity] = useState("");
   
    const [selectedRow, setSelectedRow] = useState("");

    const [storeQuantityEditModal, setStoreQuantityEditModal] = useState(false);

    const [isWareHouseQuantityUpdate, setIsWareHouseQuantityUpdate] = useState(false);

    const [showSearch, setShowSearch] = useState(false);

    const [visible, setVisible] = useState(false)

    const [showReplenishRequired, setShowReplenishRequired] = useState(true)

    const [showReplenished, setShowReplenished] = useState(false);

    const [showReplenishNotRequired, setShowReplenishNotRequired] = useState(true)

    const [replenishStoreList, setReplenishStoreList] = useState([])

    const [unSelectedStore, setUnSelectedStores] = useState([])

    const [isLoading, setIsLoading] = useState(false);

    const [replenishmentPermission,setReplenishmentPermission] = useState();
    const [manageOthersPermission,setManageOthersPermisson] = useState(false);

    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [isRender, setIsRender]=useState(false)
    const [values, setValues] = useState({
        status: null,
    });
    const [replenishPendingList, setPendingList] = useState([]);
    const [isSubmit,setIsSubmit] = useState(false)
    const isFocused = useIsFocused();

       

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        loadInitialData();
        getPermission();
    }, []);

    useEffect(()=>{
        getList(values)
    },[isFocused])
    useEffect(()=>{
        if(refreshing){
            getList(values)

        }
    },[refreshing])

    useEffect(() => {
        if (selectedRow) {
            if (selectedRow?.quantity != null) {
                setValue("quantity", { label: `${selectedRow?.quantity}`, value: `${selectedRow?.quantity}` });
            }

            if (selectedRow?.min_quantity != null) {
                setValue("min_quantity", { label: `${selectedRow?.min_quantity}`, value: `${selectedRow?.min_quantity}` })
            }

            if (selectedRow?.max_quantity != null) {
                setValue("max_quantity", { label: `${selectedRow?.max_quantity}`, value: `${selectedRow?.max_quantity}` })
            }
        } else {
            reset();
        }
    }, [selectedRow]);

    const loadInitialData = async () => {
        if (params && params.productId) {
            const updatedPriceProductList = await productService.getProductUpdatedPrice(null, params.productId);
            if (updatedPriceProductList && updatedPriceProductList.length > 0) {
                setSelectedProduct(updatedPriceProductList[0]);
                getReplenishStoreList(updatedPriceProductList[0]);
            }
        }
    }

  const getPermission = async () => {
    const isExist = await PermissionService.hasPermission(Permission.REPLENISHMENT_EDIT);
    const manageOthers = await PermissionService.hasPermission(Permission.REPLENISHMENT_MANAGE_OTHERS);
    setReplenishmentPermission(isExist)
   setManageOthersPermisson(manageOthers)
   
  }

    const toggle = () => {
        setScanModalVisible(!modalVisible);
    }

    const productNotFoundToggle = () => {
        setProductNotFoundModalOpen(!productNotFoundModalOpen);
    }

    const productSelectModalToggle = () => {
        setProductSelectModalOpen(!productSelectModalOpen);
    }

    const onProductClick = (item) => {
        setSelectedProduct(item);
        getReplenishStoreList(item);
    }

    //search results
    const handleChange = async (search) => {
        setSearchParam(search)
    };

    const onEndEditing = async () => {

        setShowReplenishRequired(true);

        if (searchParam) {

            let products = await productService.SearchFromLocalDB(searchParam);

            if (products && products.length == 1) {

                setSelectedProduct(updatedPriceProductList[0])

            } else if (products && products.length > 1) {

                //set store product list
                setProductList(products);

                setProductSelectModalOpen(true);

            }
        }
    }

    const getReplenishStoreList = (selectedProduct, unselectedStores) => {
        try {

            let paramsObject = new Object();

            paramsObject.productId = selectedProduct.product_id;

            if (unselectedStores && unselectedStores.length > 0) {
                paramsObject.unselectedStores = unselectedStores.join(',')
            }

            if (selectedProduct) {

                StoreProductService.replenishSearch(paramsObject, (err, response) => {

                    if (response && response.data) {

                        setReplenishStoreResponse(response.data);

                        let replenishStoreList = response.data.replenishStoreList;

                        if (replenishStoreList && replenishStoreList.length > 0) {
                            for (let i = 0; i < replenishStoreList.length; i++) {

                                if (unselectedStores && unselectedStores.length > 0) {

                                    let inUnselected = unselectedStores.find((storeId) => storeId == replenishStoreList[i].store_id);

                                    if (inUnselected) {
                                        replenishStoreList[i].isChecked = false;
                                    } else {
                                        replenishStoreList[i].isChecked = true;
                                    }
                                } else {
                                    replenishStoreList[i].isChecked = true;
                                }
                            }
                        }

                        setReplenishStoreList(replenishStoreList);


                    }

                })

            }
        } catch (err) {
            console.log(err);
        }
    }


    const getProducts = async (barCode) => {

        const updatedPriceProductList = await productService.getProductUpdatedPrice(barCode);

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {

            setSelectedProduct(updatedPriceProductList[0]);

            getReplenishStoreList(updatedPriceProductList[0]);

        } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

            //set store product list
            setProductList(updatedPriceProductList);

            setProductSelectModalOpen(true);

        } else {
            productNotFoundToggle();
        }
    }

    //scan product handler
    const handleScannedData = async (data) => {

        try {

            if (data && data.activeTab) {
                setIsLoading(true)
            }
            setScanModalVisible(false);

            setShowReplenishRequired(true);

            setListVisible(false)
            setModelVisible(true)

            //get bar code
            let barCode = data?.data;

            //validate bar code exist and loading
            if (barCode) {

                //set scanned code
                setScannedCode(barCode);

                const updatedPriceProductList = await productService.getProductUpdatedPrice(barCode);


                if (updatedPriceProductList && updatedPriceProductList.length == 1) {

                    setSelectedProduct(updatedPriceProductList[0]);

                    getReplenishStoreList(updatedPriceProductList[0]);

                } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

                    //set store product list
                    setProductList(updatedPriceProductList);

                    setProductSelectModalOpen(true);

                } else {

                    SyncService.SyncProduct(barCode, null, (response) => {
                        getProducts(barCode);
                    })

                }
                setIsLoading(false)

            }
        } catch (err) {
            console.log(err);
        }
    };

    const onClear = () => {
        setSelectedProduct("");
        setReplenishStoreResponse("");
        setReplenishStoreList("");
    }


    const quantitySelectModalToggle = () => {
        setQuantitySelectModal(!openQuantitySelectModal);
        setSelectedRow("");
        setSelectedQuantity("");
    }

    const toggleQuantitySelectModal = () => {
        setStoreQuantityEditModal(false);
        setSelectedRow("");
        setIsWareHouseQuantityUpdate(false);
    }

    const quantityOnChange = (value) => {
        setSelectedQuantity(value);
    }

    const handleWareQuantityClick = () => {
        setStoreQuantityEditModal(true);
        setSelectedRow(replenishResponse?.distributionCenterStoreProducDetail);
        setIsWareHouseQuantityUpdate(true);
    }


    const handleReplenishClick = (data) => {
        setSelectedRow(data);
        setSelectedQuantity(data.replenishQuantity ? data.replenishQuantity : data.replenishedQuantity)
        setQuantitySelectModal(true);
    }
    const handleFilterSubmit = async () => {
        getList({ ...values });
        closeAndOpenFilterDrawer()
      };

  const closeAndOpenFilterDrawer = () => {
    setIsOpenFilter(!isOpenFilter);
  };

  const getList = async (values) => {
    try {
        replenishPendingList && replenishPendingList.length == 0 && setIsLoading(true);        

      await ReplenishService.search(
        { status: values?.status?.value ? values?.status?.value : "" },
        (err, response) => {
          if (response && response?.data && response?.data?.data) {
            setPendingList(response && response?.data && response?.data?.data);
            setIsLoading(false);
            setRefreshing(false)
          }
        }
      );
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

    const onReplenishHandler = () => {
        setIsSubmit(true)
        if (selectedQuantity >= 0) {

            let bodyData = { toLocationId: selectedRow?.store_id, quantity: selectedQuantity, productId: selectedRow?.productId };

            InventoryTransferService.replenish(bodyData, (error, response) => {
                if (response) {
                    quantitySelectModalToggle()
                    getReplenishStoreList(selectedProduct)
                    setIsSubmit(false)
                }else{
                    setIsSubmit(false)
                }
            })
        }
    }

    const replenishAll = async () => {

        if (replenishStoreList && ArrayList.isNotEmpty(replenishStoreList)) {
            let replenishBody = new Array();

            for (let i = 0; i < replenishStoreList.length; i++) {
                if (replenishStoreList[i].isChecked && replenishStoreList[i].replenishQuantity > 0) {
                    replenishBody.push({
                        toLocationId: replenishStoreList[i].store_id,
                        quantity: replenishStoreList[i].replenishQuantity,
                        productId: replenishStoreList[i].productId,
                    })
                }
            }

            if (replenishBody && replenishBody.length > 0) {

                InventoryTransferService.replenishAll({ replenishList: replenishBody }, () => {

                    setVisible(false);
                    setListVisible(true)
                    setModelVisible(false)

                    onClear();

                });
            }

        }
    }

    const storeProductUpdate = async (values) => {
      setIsSubmit(true)
        const data = new Object();

        let storeProductId = replenishResponse?.distributionCenterStoreProducDetail?.id;

        data.quantity = selectedQuantity ? selectedQuantity:replenishResponse?.distributionCenterQuantity;


        if (storeProductId) {

            StoreProductService.update(storeProductId, data, (err, response) => {
                if (response && response.data) {
                    getReplenishStoreList(selectedProduct);
                    toggleQuantitySelectModal(false);
                    setSelectedQuantity("")
                    setIsSubmit(false)
                }else{
                    setIsSubmit(false)
                }
            });
        }
    };

    const onSelectStore = (selectedData, value) => {

        let unselectedStores = [...unSelectedStore];

        let replenishStores = [...replenishStoreList];

        if (replenishStores && replenishStores.length > 0) {

            let index = replenishStores.findIndex((data) => data.store_id == selectedData.store_id);

            if (index > -1) {
                replenishStores[index].isChecked = value;
            }
        }

        setReplenishStoreList(replenishStores)

        if (unselectedStores && unselectedStores.length > 0) {

            let index = unselectedStores.findIndex((data) => data.storeId == selectedData.store_id);

            if (index == -1 && !value) {
                unselectedStores.push(selectedData.store_id)
            } else if (!value) {
                unselectedStores.splice(index, 1)
            }
        } else if (!value) {
            unselectedStores.push(selectedData.store_id);
        }

        setUnSelectedStores(unselectedStores);

        getReplenishStoreList(selectedProduct, unselectedStores);
    }

    const renderItem = (items, quantityAttribute, showUnSelect) => {
        let data = items?.item;
        return (
            <>
                <Card style={{ marginVertical: 5, borderColor: '#333', borderWidth: 0.1, borderBottomWidth: 0, backgroundColor: data.replenishQuantity > 0 ? data.storeColorCode ? data.storeColorCode : "#dc3545" : "#D3D3D3" }}>
                    <Card.Content style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", borderBottomColor: "white", borderBottomWidth: 1, paddingBottom: 5 }}>
                        <Title style={{ color: 'white' }}>{data.locationName}</Title>

                        {showUnSelect && (
                            <Checkbox
                                toggleCheckbox={(value) => onSelectStore(data, value)}
                                color={"white"}
                                isChecked={data.isChecked}
                            />
                        )}
                    </Card.Content>

                    <Card.Content >
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
                            <View>
                                <Text style={{ color: "white" }} variant="titleLarge">{replenishResponse?.replenishBy == Replenishment.ORDER ? `Min Order Qty: ${data.minOrderQuantity != null ? data.minOrderQuantity : ""}` : `Min Stock Qty: ${data.min_quantity != null ? data.min_quantity : "" }`}</Text>
                                <Text style={{ color: "white" }} variant="bodyMedium">{replenishResponse?.replenishBy == Replenishment.ORDER ? `Max Order Qty: ${data.maxOrderQuantity != null ? data.maxOrderQuantity : ""}` : `Max Stock Qty: ${data.max_quantity != null ? data.max_quantity : ""}`}</Text>
                                <Text style={{ color: "white" }} variant="bodyMedium">Available: {data.tempQuantity}</Text>
                            </View>

                            {quantityAttribute && (
                                <View>
                                    <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>{data[quantityAttribute]}</Text>
                                </View>
                            )}
                        </View>
                    </Card.Content>
                </Card>
            </>
        )
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => {
                        closeRow(rowMap, data?.item.id);
                        handleReplenishClick(data?.item)
                    }}
                >
                    <Text style={styles.btnText}>{data?.item?.replenishQuantity ? "Complete" : "Update"}</Text>
                </TouchableOpacity>
            </View>

        )
    };

    const ReplenishCard = ({ replenishArray, quantityAttribute, title, expanded, onExpandClick, showUnSelect }) => {


        return (
            <>
                {replenishArray && ArrayList.isNotEmpty(replenishArray) && (
                    <List.Section>
                        <List.Accordion title={title} expanded={expanded} onPress={onExpandClick} titleStyle={{ color: Color.BLACK, fontWeight: "bold" }}>

                            <SwipeListView
                                data={replenishArray}
                                renderItem={(rowData) => renderItem(rowData, quantityAttribute, showUnSelect)}
                                renderHiddenItem={renderHiddenItem}
                                rightOpenValue={-80}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                disableRightSwipe={true}
                                disableLeftSwipe={replenishmentPermission ? false : true}
                                closeOnRowOpen={true}
                                keyExtractor={item => String(item.id)}
                            />

                        </List.Accordion>
                    </List.Section>
                )}
            </>
        );
    }

    const handleBack=()=>{
        setListVisible(true)
        setReplenishStoreResponse("")
        setReplenishStoreList([])
        setSelectedProduct("")
    }

    const handleRemoveFilter=(removeFilter)=>{
        setIsRender(true)
        setValues((prevValues) => ({
            ...prevValues,
            ...removeFilter
        }));
        setTimeout(() => {
            setIsRender(false);
          }, 100);
    }



    

    return (
        <Layout
            title={"Replenishment"}
            showBackIcon={listVisible && !selectedProduct ? false : true}
            showScanner
            FooterContent={replenishResponse && ArrayList.isNotEmpty(replenishResponse.replenishStoreList) && 
                <Button loading={false} title={"Complete All"} backgroundColor={Color.GREEN} onPress={() => replenishAll()} />}
            openScanner={toggle}
            closeModal={visible}
            backButtonNavigationUrl={ !listVisible ?  "ProductReplenish":false}
            backButtonNavigationOnPress={()=> !listVisible ? handleBack() :"" }
            onFilterPress={()=>  setIsOpenFilter(!isOpenFilter)}
            showFilter = {!listVisible || selectedProduct  ? false : true}
            isLoading = {isLoading}
        >


            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
            {listVisible && !selectedProduct && (
                <View style={styles.searchBar}>

                    
                         <SearchBar
                            searchPhrase={searchPhrase}
                            setSearchPhrase={setSearchPhrase}
                            setClicked={setClicked}
                            clicked={clicked}
                            onPress={onClear}
                            onEndEditing={onEndEditing}
                            handleChange={handleChange}
                            noScanner
                        />
                     
  
                <SelectedFilter initialValues={values} handleRemoveFilter={handleRemoveFilter}/>
                </View>
                 )} 
                <BarcodeScanner
                    toggle={toggle}
                    modalVisible={modalVisible}
                    handleScannedData={handleScannedData}
                />

                {productSelectModalOpen && (
                    <ProductSelectModal
                        modalVisible={productSelectModalOpen}
                        toggle={productSelectModalToggle}
                        items={productList}
                        updateAction={onProductClick}
                    />
                )}

                <ConfirmationModal
                    toggle={productNotFoundToggle}
                    modalVisible={productNotFoundModalOpen}
                    title={AlertMessage.PRODUCT_NOT_FOUND}
                    description={`BarCode ID ${scannedCode} not found please scan different code or add the product`}
                    confirmLabel={"Ok"}
                    ConfirmationAction={productNotFoundToggle}
                />

                {openQuantitySelectModal && (
                    <AddTransferModal
                        modalVisible={openQuantitySelectModal}
                        toggle={quantitySelectModalToggle}
                        value={selectedQuantity}
                        ConfirmationAction={onReplenishHandler}
                        showQuantityIncrementButton
                        quantity={selectedRow && selectedRow.replenishQuantity ? selectedRow.replenishQuantity : selectedRow.replenishedQuantity}
                        quantityOnChange={quantityOnChange}
                        title={"Update Quantity"}
                        confirmButtonLabel={"Update"}
                        isSubmit = {isSubmit}
                    />
                )}

                {storeQuantityEditModal && (
                    <StoreQuantityEditModal
                        modalVisible={storeQuantityEditModal}
                        toggle={toggleQuantitySelectModal}
                        ConfirmationAction={handleSubmit(values => storeProductUpdate(values))}
                        quantityOnChange={quantityOnChange}
                        quantity={selectedRow?.quantity}
                        isSubmit = {isSubmit}
                    />
                )}
                    <>      
      <View style={styles.modalBackground}>
            <>
          {selectedProduct  &&(
            <View style={[styles.modalContent]}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 0.8 }}>
                  <ProductCard
                    name={selectedProduct?.name || selectedProduct?.product_name}
                    brand={selectedProduct.brand_name}
                    mrp={selectedProduct.mrp}
                    sale_price={selectedProduct.sale_price}
                    image={selectedProduct.featured_media_url}
                    noIcon
                  />
                </View>
                <View style={{ flex: 0.2 }}>
                  {replenishResponse && (
                    <View style={styles.container}>
                      <TouchableOpacity onPress={() => handleWareQuantityClick()}>
                        <View style={styles.circle}>
                          <Text style={styles.bottomNumber}>{replenishResponse?.distributionCenterQuantity}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {replenishResponse && (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 16 }}>{`Allocated: ${replenishResponse?.totalReplenishQuantity}`}</Text>
                  <Text style={{ fontSize: 16 }}>{`Balance: ${replenishResponse?.totalBalanceQuantity}`}</Text>
                </View>
              )}
        </View>
              
              )}

              <ReplenishCard
                replenishArray={replenishStoreList}
                quantityAttribute={"replenishQuantity"}
                title="Replenishment Required"
                expanded={showReplenishRequired}
                onExpandClick={() => setShowReplenishRequired(!showReplenishRequired)}
                showUnSelect={true}
              />

              <ReplenishCard
                replenishArray={replenishResponse?.replenishedStoreList}
                quantityAttribute={"replenishedQuantity"}
                title={"Replenished"}
                expanded={showReplenished}
                onExpandClick={() => setShowReplenished(!showReplenished)}
                showUnSelect={false}
              />

              <ReplenishCard
                replenishArray={replenishResponse?.noReplenishStoreList}
                expanded={showReplenishNotRequired}
                onExpandClick={() => setShowReplenishNotRequired(!showReplenishNotRequired)}
                title={"Replenishment Not Required"}
                showUnSelect={false}
              />
            </>
            
      </View>
                    </>
                     {listVisible  && !selectedProduct && 
                    <PendingList
                     onReplenishHandler={handleScannedData}
                     isOpenFilter={isOpenFilter}
                     setIsOpenFilter={setIsOpenFilter}
                     manageOthersPermission={manageOthersPermission}
                     values={values}
                     setValues={setValues}
                     isRender={isRender}
                      setPendingList={setPendingList}
                      replenishPendingList={replenishPendingList}
                      handleSubmit={handleFilterSubmit}
                      closeAndOpenFilterDrawer={closeAndOpenFilterDrawer}
                     />
                }
                 </Refresh>
        </Layout>

    );
};

export default Replenish;

const styles = StyleSheet.create({
    searchBar: {
        flex: 0.2,
        backgroundColor: "#fff",
        flexDirection: "column",
    },
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: '#009dda',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        top: 14,
    },
    topNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        bottom: 40,
    },
    line: {
        width: '100%',
        height: 2,
        backgroundColor: 'white',
        position: 'absolute',
        top: '50%',
    },
    swipeStyle: {
        flex: 1,
    },
    actionDeleteButton: {
        alignItems: 'center',
        bottom: 6,
        justifyContent: 'center',
        position: 'absolute',
        top: 6,
        width: 75,
        backgroundColor: Color.BLACK,
        right: 7,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',

      },
      modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '100%', // Adjust as needed
      },
    btnText: {
        color: Color.WHITE,
    },
});
