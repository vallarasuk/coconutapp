// Import React and Component
import React, { useEffect, useState } from "react";
import {
    ScrollView
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SearchBar from "./SearchBar";
import Fuse from 'fuse.js';
import ArrayList from "../lib/ArrayList";
import PublicRouteService from "../services/PublicRouteService";
import PublicLayout from "./Layout/PublicLayout";
import ListUI from "./ListUI";
import Spinner from "./Spinner";


const JobSelector = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [jobList, setJobList] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [search, setSearch] = useState(false);


    const isFocused = useIsFocused();

    const navigator = useNavigation();

    useEffect(() => {
        getJobList(true);
    }, [isFocused]);

    useEffect(() => {
        getJobList(true);
    }, []);

    const getJobList = async (initalLoad) => {
        if (initalLoad) {
            setIsLoading(true);
        }


        let jobs = new Array()
        await PublicRouteService.getJobs((response) => {
            if (response && response?.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    jobs.push({
                        label: response[i].job_title,
                        value: response[i].id,
                        description: response[i].job_description
                    })
                }
                if (initalLoad) {
                    setIsLoading(false);
                }
                setJobList(jobs)
            }
        })
    }



    const handleChange = async (search) => {

        if (search) {

            let storeListData = new Array();

            const fuseOptions = {
                keys: ['label'],
            };

            const fuse = new Fuse(jobList, fuseOptions);
            let results = fuse.search(search);
            if (ArrayList.isNotEmpty(results)) {
                for (let i = 0; i < results.length; i++) {
                    storeListData.push({
                        ...results[i]?.item
                    })
                }
            }
            setJobList(storeListData)
        } else {
            getJobList(false);
        }

    }
    const onPress = (rowValue) => {
        navigator.navigate("ApplyNowPage", { param: rowValue });
    }
    if (isLoading) {
        return <Spinner />;
    }
    
    return (
        <>
            <PublicLayout
                title="Select Job"
                showBackIcon
            >

                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    clicked={clicked}
                    setSearch={setSearch}
                    onPress={getJobList}
                    handleChange={handleChange}
                    noScanner
                />
                <ScrollView>
                    <ListUI List={jobList} selectProperty={"label"} onPress={onPress} />
                </ScrollView>
            </PublicLayout>
        </>
    );
};

export default JobSelector;
