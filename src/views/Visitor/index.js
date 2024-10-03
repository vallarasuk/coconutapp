// Import React and Component
import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import VisitorService from "../../services/VisitorService";
import Refresh from "../../components/Refresh";
import ShowMore from "../../components/ShowMore";
import VisitorCard from "./VisitorCard";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
import styles from "../../helper/Styles";


const Visitor = (props) => {
    const [visitorList, setVisitorList] = useState([]);
    const [permission, setPermission] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [ addPermission, setAddPermission] = useState()
    //setting tha initial page
    const [page, setPage] = useState(2);
    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);
    const isFocused = useIsFocused();

    const navigation = useNavigation();

    useEffect(() => {
        let mount = true;
        mount && getVisitorList({search : searchPhrase})
        mount && getPermission()
        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused]);
    useEffect(()=>{
        if(refreshing){
            getVisitorList({search : searchPhrase})
        }
    },[refreshing])

    const getVisitorList = async (values) => {
        try {
            visitorList && visitorList.length == 0 && setIsLoading(true);

            let params = { page: 1, search : values ? values?.search : "" };

            VisitorService.search(params, (response) => {
                let visitor = response?.data?.data;
                setIsLoading(false);
                setRefreshing(false)
                setVisitorList(visitor);
            })
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };


    const getPermission = async () => {
        const AddPermission = await PermissionService.hasPermission(Permission.VISITOR_ADD);
        setAddPermission(AddPermission)
    }


    const AddNew = () => {
        navigation.navigate("Visitor/Form");
    };

    const handleChange = async (search) => {
        getVisitorList( { search: search })
    };

    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            let params = { page: page }

            VisitorService.search(params, (response) => {

                let visitors = response?.data?.data;

                // Set response in state
                setVisitorList((prevTitles) => {
                    return [...new Set([...prevTitles, ...visitors])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(visitors.length > 0);
                setIsFetching(false);
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };


    return (
        <Layout
            title={"Visitors"}
            addButton={addPermission ? true : false}
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
                        onPress={getVisitorList}
                        handleChange={handleChange}
                        noScanner
                    />
                </View>
                <View style={styles.container}>
                    <VisitorCard
                        visitorList={visitorList}
                    />
                    <ShowMore List={visitorList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

                </View>
            </Refresh>
        </Layout>
    );
};

export default Visitor;

