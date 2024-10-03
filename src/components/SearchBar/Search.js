import React from "react";
import SearchBar from ".";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from "react-native";
import { Color } from "../../helper/Color";
import { FontAwesome5 } from "@expo/vector-icons";

const Search = ({ searchPhrase, setSearchPhrase, setClicked, clicked, handleChange, openScanner, onPress, onEndEditing }) => {

    return (
        <>
            <View style={{ width: searchPhrase ? '100%' : '85%',flexDirection : 'row' }}>

                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    onPress={onPress}
                    clicked={clicked}
                    handleChange={handleChange}
                    onEndEditing={onEndEditing}
                    noScanner
                />
           

            {!searchPhrase && (
                <FontAwesome5 name="barcode"
                    size={26}
                    color={Color.BLACK}
                    onPress={() => openScanner()}
                    style={{
                        marginLeft : 20,
                        marginTop : 20
                    }}

                />
            )}
             </View>
        </>
    );
}

export default React.memo(Search);
