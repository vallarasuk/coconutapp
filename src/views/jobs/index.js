import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AddButton from "../../components/AddButton";
import PublicLayout from "../../components/Layout/PublicLayout";
import { Color } from "../../helper/Color";

const ApplyNowPage = (props) => {
    let data = props.route.params.param;


    let navigator = useNavigation()
    return (
        <PublicLayout
            title={data?.label}
            showBackIcon
        >
            <>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <Text>{data?.description}</Text>
                    </ScrollView>
                </View>
                <AddButton
                    color={Color.GREEN}
                    label="APPLY NOW"
                    onPress={() => {
                        navigator.navigate("JobCandidateForm", { data });
                    }}
                    style={{ backgroundColor: "blue" }}
                />
            </>

        </PublicLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollView: {
        padding: 16,
    },
});

export default ApplyNowPage;
