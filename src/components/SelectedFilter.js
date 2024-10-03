import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Color } from "../helper/Color";


const SelectedFilter = (props) => {
    let { initialValues }=props;

    let hideParamsValue = {};


    let filteredArrayValues = [];
    let filteredObjectValues = [];
    let filteredNormalValues = [];
    if (initialValues && initialValues !== undefined) {
        const filteredData = Object.fromEntries(
            Object.entries(initialValues).filter(
                ([key, value]) => value !== undefined && value !== null && value !== ""
            )
        );
        if (filteredData) {
            const arrayValues = [];
            const objectValues = [];
            const normalValues = [];

            for (const [key, value] of Object.entries(filteredData)) {
                if (Array.isArray(value)) {
                    arrayValues.push({ [key]: value });
                } else if (typeof value === "object" && value !== null) {
                    objectValues.push({ [key]: value });
                } else {
                    normalValues.push({ [key]: value });
                }
            }

            for (const item of arrayValues) {
                const key = Object.keys(item)[0];
                const value = item[key][0];
                let filteredKey =
                    Object.keys(hideParamsValue).find((values) => values === key) || "";
                if (value !== undefined && !filteredKey) {
                    filteredArrayValues.push({ [key]: value?.label });
                }
            }

            for (let item of objectValues) {
                const key = Object.keys(item)[0];
                const value = item[key];
                let filteredKey =
                    Object.keys(hideParamsValue).find((values) => values === key) || "";
                if (value !== undefined && !filteredKey) {
                    if (key === "product") {
                        filteredObjectValues.push({ [key]: value?.label?.props?.url });
                    } else {
                        filteredObjectValues.push({ [key]: value?.label });
                    }
                }
            }

            for (let item of normalValues) {
                const key = Object.keys(item)[0];
                const value = item[key];
                let filteredKey =
                    Object.keys(hideParamsValue).find((values) => values === key) || "";
                if (value !== undefined && !filteredKey) {
                    filteredNormalValues.push({ [key]: value });
                }
            }
        }
    }

    let mergedValues = [
        ...filteredArrayValues,
        ...filteredObjectValues,
        ...filteredNormalValues,
    ];

    const handleRemoveFilter=(obj)=>{
        let objectvalue = {};
        let key = Object.keys(obj)[0];
        objectvalue[key] = "";
        props.handleRemoveFilter &&  props.handleRemoveFilter(objectvalue)
    }

    return (
        <View style={styles.row}>
            {mergedValues && mergedValues.length > 0 && mergedValues.map((obj, index) => (
                <View key={index} style={styles.filterItem}>
                    <Text style={styles.label}>
                        {Object.keys(obj)[0]}:
                    </Text>
                    <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>
                            {obj[Object.keys(obj)[0]]}
                        </Text>
                        <TouchableOpacity onPress={() => handleRemoveFilter(obj)}>
                            <MaterialIcons name="close" size={15} color={Color.WHITE} onPress={() => handleRemoveFilter(obj)} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    )

}

export default SelectedFilter;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor:"#f5f7fa",
        alignItems:"center",
    },
    filterItem: {
        flexDirection: 'row',
        marginTop:5,
        marginBottom:5,
        marginLeft:5
    },
    label: {
        backgroundColor: "#e7e7ea",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        textTransform: 'capitalize',
        fontSize: 12,
        alignItems: 'center',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingBottom: 6,
        paddingTop: 6,
        paddingLeft: 4,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    valueText: {
        fontSize: 12,
        minWidth: 50,
        color: "white"
    },
    icon: {
        marginLeft: 4,
    },
});