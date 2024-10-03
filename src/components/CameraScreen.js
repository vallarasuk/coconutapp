import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../helper/Color";
import AttendanceService from "../services/AttendanceService";
import Spinner from "./Spinner";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";

const CameraScreen = (props) => {
 let params = props?.route?.params;
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading]=useState(false)


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera permission in your device settings to use the camera feature.",
          [
            { text: "Cancel", onPress: () => {} },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
      }
    })();
  }, []);


  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo?.uri);
      await savePhotoToLibrary(photo?.uri);
    }
  };
  const savePhotoToLibrary = async (uri) => {
    await MediaLibrary.saveToLibraryAsync(uri);
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleOk = async (e) => {
    if(e){
      if (props?.route?.params?.isCheckOut && props?.route?.params?.isCheckOut == true) {
        // checkOunt
        setIsLoading(true)
        AttendanceService.checkOut(props?.route?.params?.id,photoUri, async (err,response) => {
          if(response){
            if(props?.route?.params?.forceLogout === "true"){
              await AsyncStorage.clearAll()
              props?.route?.params?.navigation.navigate("Login");
              }else{
                props?.route?.params?.navigation.navigate("Dashboard");
                }
             await AsyncStorage.clear(AsyncStorageConstants.SHIFT)
              setIsLoading(false);
           }          
        })
      } else {
        // checkIn
          setIsLoading(true)
           AttendanceService.CheckIn(
          params?.navigation,
            params?.reDirectionUrl,
          setIsLoading,
          { login: true },
          {store_id: params?.store_id, shift_id: params?.shift_id},
          photoUri
        );
      }




    }
  };

  if(isLoading){
    return <Spinner/>
  }

  return (
    <View style={{ flex: 1 }}>
     {hasPermission ? <View style={{ flex: 1 }}>
        {photoUri ? (
          <>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{ ...styles.roundButton, backgroundColor: Color.BLACK }}
                onPress={() => setPhotoUri(null)}
              >
                <MaterialIcons name="close" size={35} color={Color.WHITE} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.roundButton, backgroundColor: Color.BLACK }}
                onPress={handleOk}
              >
                <MaterialIcons name="done" size={35} color={Color.WHITE} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef} style={{ height: 600,marginTop:100 }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={takePicture}
              >
                <MaterialIcons name="camera-enhance" size={35} color={Color.WHITE} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={toggleCameraType}
              >
                <MaterialIcons
                  name="swap-horizontal-circle"
                  size={35}
                  color={Color.WHITE}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>:(
          hasPermission !==null && <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Camera permission is required to use this feature.</Text>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  previewImage: {
    flex: 1,
    resizeMode: "contain",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Color.WHITE,
  },
});

export default CameraScreen;
