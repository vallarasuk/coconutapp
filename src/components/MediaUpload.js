import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Layout from "./Layout";
import { useNavigation } from "@react-navigation/native";
import DoneButton from "./DoneButton";
import mediaService from "../services/MediaService";
import MediaList from "./MediaList";
import { useForm } from "react-hook-form";
import Alert from "../components/Modal/Alert";
import MediaVisible from "../helper/MediaVisible";
import { BackHandler } from "react-native";





const MediaUpload = (props) => {
    const { prefillImage } = props;
    const [visible, setVisible] = useState(false);
    const [MediaData, setMediaData] = useState([]);
    const [images, setImages] = useState([]);
    const [ids, setIds] = useState();
    const params = props?.route?.params;

    useEffect(() => {
        getMediaList();
    }, [])

    useEffect(() => {
      
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            return true;
          }
        );
        return () => backHandler.remove();
   
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
    });
    const getMediaList = async () => {
        if(params.id){
        await mediaService.search(params.id, params.object, callback => setMediaData(callback.data.data))
    }
}


    const hideMenu = () => setVisible(false);
    const showMenu = (e) => {
        setVisible(true)
    };
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    async function dataURItoBlob(data) {
        const response = await fetch(data);
        const blob = await response.blob();
        if (blob) {
            setFile(blob);
        }
    }

   
    const uploadImage = (file, image) => {
        if (file) {
            const data = new FormData();
            let files = {
                type: file?._data?.type,
                size: file?._data.size,
                uri: image,
                name: file?._data.name,
            };
            data.append("media_file", files);
            data.append("media_name", file?._data.name);
            data.append("object", "SALE_SETTLEMENT");
            data.append("object_id", props?.route?.params?.id);
            data.append("media_visibility", MediaVisible.VISIBILITY_PRIVATE);

            let mediaObj = [{
                url: image
            }];

            if (MediaData && MediaData.length > 0) {
                let updatedMediaList = [...mediaObj, ...MediaData]
                setMediaData(updatedMediaList);
            } else {
                setMediaData(mediaObj)
            }


            mediaService.uploadMedia(navigation, data, async (error, response) => {
                let id = response?.id
                setIds(id)
                if (response) {
                    getMediaList()
                }
            });
        }
    };


    const removeImage = () => {
        if (ids) {
            mediaService.deleteMedia(ids, (error, response) => {
                getMediaList();
            });
        }

    }


    const takePicture = async () => {

        let permission = await ImagePicker.requestCameraPermissionsAsync()

        let mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission && permission.status == 'granted' && mediaPermission && mediaPermission.status == 'granted') {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                quality: 1,
            });

            if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                const response = await fetch(result.assets[0].uri);
                if (response) {
                    const blob = await response.blob();
                    setFile(blob)


                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                        addNewEntry(blob, result.assets[0].uri);
                        setImages([...images, { uri: result.assets[0].uri }]);

                    }
                }
            }
        }
    }



    const addNewEntry = async (file, image) => {
        await uploadImage(file, image)
    }

    return (

        <Layout
            title="Paytm Video"
            buttonOnPress={(e) =>takePicture(e) }
            buttonLabel={"Upload"}
            showBackIcon={false}
            FooterContent={(<DoneButton
                onPress={() => {
                    image ?  navigation.navigate("SalesSettlement") : Alert.Error("Paytm Video is required");
                }}
    
            />)  }
        >
            <MediaList
                mediaData={MediaData}
                getMediaList={getMediaList}
            />
    
        </Layout >

    );
};
export default MediaUpload;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
  
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
   
});

