import React from "react";

import { View, Text, FlatList, TouchableOpacity } from "react-native";

import { Color } from "../../../helper/Color";

const Filter = ({ categoryList, onCategorySelect, selectedCategory }) => {

    const ListItem = React.memo(function ListItem({ item }) {
        let isSelected = selectedCategory && selectedCategory.length > 0 ? selectedCategory.findIndex((data)=> data == item.value) > -1 ? true : false : false;
        
        return (
            <TouchableOpacity
                onPress={() => onCategorySelect(item)}
                style={{ backgroundColor: Color.WHITE, borderColor: Color.WHITE, borderRadius: 3, borderWidth: 1, height: 40, marginHorizontal: 10, paddingHorizontal: 10 }}
            >
                <View style={{ flex: 1, justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: isSelected ?  Color.RED : Color.GREY, fontSize: 12 }} numberOfLines={2}>{item.label}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <View style={{ backgroundColor: Color.LIGHT_GREY, alignItems: "center", justifyContent: "center", paddingVertical: 10 }}>
            <FlatList
                data={categoryList}
                renderItem={(data) => (<ListItem item={data?.item} />)}
                horizontal={true}
                keyExtractor={(item) => String(item.value)}
            />
        </View>
    );
}

export default Filter;