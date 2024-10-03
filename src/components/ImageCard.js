import React from "react";
import { Image } from "react-native";

const ImageCard = (props) => {
  const { ImageUrl, width, height } = props;
  return (
    <Image
      source={{ uri: ImageUrl }}
      style={{ width: width ? width : 50, height: height ? height : 50 }}
    />
  );
};
export default ImageCard;
