import React, { useCallback } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Spinner from "./Spinner";

const Refresh = ({ children, refreshing,isLoading, setRefreshing, onScroll }) => {
    const wait = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);
    if (isLoading && !refreshing) {
        return <Spinner />;
      }
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
            onScroll={onScroll}
            showsVerticalScrollIndicator = {false}
        >
            <View>
            {children}
            </View>
        </ScrollView>
    )

}
export default Refresh;