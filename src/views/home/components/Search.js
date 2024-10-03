

import React from "react";

import { View, Text, Dimensions } from "react-native";

import SearchBar from "../../../components/SearchBar";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Search = ({ cartProductLength, handleSearchOnChange, handleCartClick }) => {

    const width = Dimensions.get('window').width;

    return (
        <>
            <View style={{ width: width * 0.87 }}>
                <SearchBar
                    // searchPhrase={searchPhrase}
                    // setSearchPhrase={setSearchPhrase}
                    // setClicked={setClicked}
                    // clicked={clicked}
                    handleChange={handleSearchOnChange}
                    noScanner
                />
            </View>
            <View>
                <MaterialCommunityIcons
                    name={`cart-outline`}
                    onPress={handleCartClick}
                    size={26}
                    color="#000"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "80%",
                        transform: [{ translateY: -45 }],
                    }}
                />

                <View style={{ position: "absolute", right: 0 }}>
                    <View
                        style={{
                            backgroundColor: "#ff0000",
                            borderRadius: 10,
                            position: "absolute",
                            right: 0,
                            top: "80%",
                            transform: [{ translateY: -56 }],
                            width: 18,
                            height: 18,
                            borderRadius: 14,
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 12,
                                textAlign: "center",
                                lineHeight: 18,
                            }}
                        >
                            {cartProductLength || 0}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    )
}

export default Search;