import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color } from "../helper/Color";

const RatingCard = ({onPress,rating})=>{
    return(
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        {[1, 2, 3, 4, 5].map((starCount) => (
        <TouchableOpacity key={starCount} onPress={() => onPress(starCount)}>
            <MaterialCommunityIcons name={starCount <= rating ? "star" : "star-outline"} size={20} color={starCount <= rating ? Color.GREEN : Color.LIGHT_GREY2} />
        </TouchableOpacity>
        ))}
     </View>
    )
   
}
export default RatingCard;