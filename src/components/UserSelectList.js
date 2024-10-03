// Import React and Component
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useIsFocused } from "@react-navigation/native";

import userService from "../services/UserService";

import Spinner from "./Spinner";
import AlternativeColor from "./AlternativeBackground";
import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import Status from "../helper/Status";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../helper/Color";


const UserSelectList = (props) => {
    const { onPress, showSearch } = props

    const [userList, setUserList] = useState([]);

    const [searchPhrase, setSearchPhrase] = useState("");

    const [clicked, setClicked] = useState(false);

    const [search, setSearch] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const isFocused = useIsFocused();

    const navigation = useNavigation();

    // render the inventory list function
    useEffect(() => {
        getUserList();
    }, [isFocused]);


    const getUserList = async () => {
        // setIsLoading(true);
        setSearchPhrase("")
        //create new rray
        await userService.getList((error, response) => {
            setUserList(response);
            setIsLoading(false);
        })
    }

    if (isLoading) {
        return <Spinner />;
    }

    const handleChange = async (search) => {
        const params = {
            search: search, status: Status.ACTIVE
        }
        await userService.search(params, response => {
            setUserList(response);
        });
    }

    return (

        <ScrollView
            keyboardShouldPersistTaps="handled"
        >
            {showSearch && (
                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    clicked={clicked}
                    setSearch={setSearch}
                    onPress={getUserList}
                    handleChange={handleChange}
                    noScanner
                />
            )}
            <View style={[styles.container]}>
                {userList && userList?.length > 0 ? (
                    <View style={styles.container}>
                        <View style={{ padding: 2 }}>
                            {(
                                userList && userList.length > 0 &&
                                userList.map((item, index) => {
                                    const containerStyle = AlternativeColor.getBackgroundColor(index)

                                    return (
                                        <TouchableOpacity onPress={(e) => onPress(item)
                                        } style={[styles.containers, showSearch && containerStyle]}>

                                            <UserCard
                                                firstName={item.firstName}
                                                lastName={item.lastName}
                                                image={item.media_url}
                                            />
                                        </TouchableOpacity>
                                    )
                                })
                            )}
                        </View>

                    </View>
                ) : (
                    <View style={{ paddingVertical: 250, alignItems: "center" }}>
                        <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
                        <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
                    </View>
                )}

            </View>
        </ScrollView>
    );
};

export default UserSelectList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    containers: {
        height: 60,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
});