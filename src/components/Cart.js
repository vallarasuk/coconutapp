
import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const Cart = ({ itemCount, onCardPress }) => {

    return (
        <>
            <TouchableOpacity
                onPress={() => onCardPress()}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <MaterialCommunityIcons
                    name={`cart-outline`}
                    size={26}
                    color="#000"
                    style={{
                        position: "absolute",
                        right: 10,
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
                            right: 10,
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
                            {itemCount || 0}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity>
        </>
    )
}

export default Cart;