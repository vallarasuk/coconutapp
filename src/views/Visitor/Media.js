import React, { useState } from "react";
import { Button, Image, View, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../../helper/Color";
import { IconButton } from "react-native-paper";
import styles from "../../helper/Styles"

const FileUpload = (props) => {
  const { image, setImage, prefillImage,allowEdit,allowCamera, setFile ,upload} = props;
  const [open, setOpen] = useState(false)

  //convert bast64 inti binary
  async function dataURItoBlob(data) {
    const response = await fetch(data);
    const blob = await response.blob();
    if (blob) {
      setFile(blob);
    }
  }


  const takePicture = async () => {
    if(allowEdit){
      setOpen(true)
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
  
      dataURItoBlob(result.assets[0].uri);
      setOpen(false)
    }
  
  }
  const uploadImage = async () => {
      setOpen(true)
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
  
      dataURItoBlob(result.assets[0].uri);
      setOpen(false)
  
  }
  return (
    <View
      style={{
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {/* <View style={{paddingLeft:150}}>{!image &&<Button title="UploadImage" onPress={takePicture} />}</View> */}
      <View>
        <TouchableOpacity onPress={allowCamera ? takePicture : uploadImage}>
          {image || prefillImage ? (
            <Image
              source={{ uri: image ? image : prefillImage }}
              style={upload ? styles.imageIconGatePass : styles.imageIcon}
            />
          ) : (
            <View>
              <View >
                <IconButton
                  icon="camera"
                  size={90}
                  color={"black"}
                  style={styles.cameraColor}
                />
              </View>

            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FileUpload;
