import React from "react";
import Spinner from "./Spinner";
import { View } from "react-native";
import LoadMoreButton from "./LoadMoreButton";
import styles from "../helper/Styles";

const ShowMore = ({List, isFetching, HasMore, onPress}) => {
    return (
        <>
            {List && List.length % 25 == 0 && List.length > 0 ?
                isFetching && HasMore ? (
                    <Spinner />
                ) : !HasMore ? (
                    ""
                ) : (
                    <View
                        style={styles.layoutButton}
                    >
                         
                        <LoadMoreButton title="Show More" onPress={onPress} />
                         

                    </View>
                ) : ""}
        </>
    )

}
export default ShowMore;