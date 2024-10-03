import React, { useState, useRef } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import Swiper from 'react-native-swiper';
import { Color } from "../helper/Color";
import { Video } from "expo-av";
import { FontAwesome } from '@expo/vector-icons';
import styles from "../helper/Styles";



const VideoCard = (props) => {
  const { mediaData } = props;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideoPlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.replayAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View style={styles.containerVideo}>
      {mediaData.map((item, index) => {
        return (
          <View key={index}>
            <TouchableOpacity onPress={toggleVideoPlayback}>
              <Video
                ref={videoRef}
                source={{ uri: item.url }}
                style={styles.imageSize} 
                resizeMode="contain"
                shouldPlay={isPlaying}
                isMuted={false}
              />
              <View style={styles.videoOverlay}>
                <TouchableOpacity onPress={toggleVideoPlayback}>
                  <FontAwesome
                    name={isPlaying ? "" : !isPlaying && 'play'}
                    size={36}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default VideoCard;
