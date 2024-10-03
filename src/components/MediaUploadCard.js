import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import { Color } from "../helper/Color";
import Swiper from "react-native-swiper";
import Media from "../lib/Media";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const screenHeight = Dimensions.get('window').height;

const MediaUploadCard = (props) => {
  const { mediaData, onUploadIconPress, onPressDelete, showDelete, readOnly, customSwiperHeight, swipeContent } = props;
  const videoRefs = useRef([]); 
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  const chunkArray = (arr, chunkSize) => {
    const results = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      results.push(arr.slice(i, i + chunkSize));
    }
    return results;
  };

  const handlePlayPause = async (index) => {
    if (videoRefs.current[index]) {
      try {
        if (playingVideoIndex === index) {
          // Toggle play/pause for the currently playing video
          const status = await videoRefs.current[index].getStatusAsync();
          if (status.isPlaying) {
            await videoRefs.current[index].pauseAsync();
          } else {
            await videoRefs.current[index].playAsync();
          }
        } else {
          // Stop the previous video if a new one is being played
          if (playingVideoIndex !== null && videoRefs.current[playingVideoIndex]) {
            await videoRefs.current[playingVideoIndex].stopAsync();
          }
          // Reset video position and play
          await videoRefs.current[index].setPositionAsync(0);
          await videoRefs.current[index].playAsync();
          setPlayingVideoIndex(index); // Update the state to the current video index
        }
      } catch (error) {
        console.log("Error playing video:", error);
      }
    }
  };

  const chunkedMediaData = chunkArray(mediaData, swipeContent ? swipeContent : 3);

  useEffect(() => {
    if (playingVideoIndex !== null && videoRefs.current[playingVideoIndex]) {
      videoRefs.current[playingVideoIndex].playAsync(); // Ensure the current video is playing
    }
  }, [playingVideoIndex]);

  return (
    <View style={styles.container}>
      {mediaData && mediaData.length > 0 ? (
        <Swiper
          style={customSwiperHeight?styles.swiperHeight:styles.swiper}
          key={chunkedMediaData.length}
          showsPagination={false}
          onIndexChanged={(index) => setPlayingVideoIndex(null)} // Reset playing video index when swiper changes
        >
          {chunkedMediaData.map((chunk, chunkIndex) => (
            <View key={chunkIndex} style={styles.slideContainer}>
              {chunk.map((media, mediaIndex) => (
                <View key={mediaIndex} style={styles.imageWrapper}>
                  {Media.isImage(media.fileName) && (
                    <>
                      <Image
                        source={{ uri: media?.uri ? media.uri : media.url }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                      {onPressDelete && (
                        <View style={styles.deleteContainer}>
                          <TouchableOpacity
                            onPress={() => onPressDelete(mediaIndex)}
                          >
                            <Text style={styles.delete}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                  {Media.isVideo(media.fileName) && (
                    <View style={styles.videoContainer}>
                      <Video
                        ref={(ref) => (videoRefs.current[mediaIndex] = ref)}
                        source={{ uri: media?.uri ? media.uri : media.url }}
                        style={styles.video}
                        resizeMode="contain"
                        isMuted={false}
                        onPlaybackStatusUpdate={(status) => {
                          if (status.didJustFinish) {
                            setPlayingVideoIndex(null); // Reset playing index when video finishes
                          }
                        }}
                      />
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => handlePlayPause(mediaIndex)}
                      >
                        {playingVideoIndex === mediaIndex ? (
                          <Ionicons name="pause-circle" size={48} color="white" />
                        ) : (
                          <Ionicons name="play-circle" size={48} color="white" />
                        )}
                      </TouchableOpacity>
                      {showDelete && (
                        <View style={styles.deleteContainer}>
                          <TouchableOpacity
                            onPress={() => onPressDelete(mediaIndex)}
                          >
                            <Text style={styles.delete}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </Swiper>
      ) : (
        !readOnly && (
          <TouchableOpacity onPress={onUploadIconPress}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  swiper: {
    height: 150,
  },
  slideContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageWrapper: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    marginHorizontal: 5,
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
  },
  swiperHeight: {
    height: screenHeight * 0.4,
  },
  deleteContainer: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  delete: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  addText: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default MediaUploadCard;
