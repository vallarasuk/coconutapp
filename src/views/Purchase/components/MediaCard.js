import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import styles from "../../../helper/Styles";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const MediaCard = (props) => {
  const { mediaData } = props;
  const images = mediaData.map((item) => ({ url: item.url, id: item?.id }));
  const [intex, setIndex] = useState(0);
  const renderIndicator = (currentIndex, allSize) => {
    setIndex(currentIndex);
    return null;
  };

  return (
    <View style={styles.swipeStyle}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => props.onPress(images[intex - 1]?.id)}
      >
        <AntDesign name="delete" size={24} color="black" />
      </TouchableOpacity>
      <ImageViewer
        imageUrls={images}
        index={0}
        enableSwipeDown
        enableImageZoom
        saveToLocalByLongPress={false}
        style={styles.imageSize}
        backgroundColor="white"
        renderIndicator={renderIndicator}
      />
    </View>
  );
};

export default MediaCard;
