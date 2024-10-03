import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Media from "../helper/Media";
import mediaService from "../services/MediaService";
import ArrayList from "../lib/ArrayList";
import NoRecordFound from "./NoRecordFound";
import Label from "./Label";

export default function VoiceNoteRecorder(props) {
    let { setAudioRecordings, objectId, objectName } = props;
    const [recordings, setRecordings] = useState([]);
    const [recording, setRecording] = useState(null);
    const [playing, setPlaying] = useState(-1);
    const [sound, setSound] = useState(null);
    const [playbackStatus, setPlaybackStatus] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordingInterval, setRecordingInterval] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Animation states
    const recordingAnimation = useRef(new Animated.Value(1)).current;
    const playingAnimation = useRef(new Animated.Value(1)).current;
    const graphAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!props?.isAddPage) {
            getAudioList();
        }
    }, []);

    const getAudioList = async () => {
        await mediaService.search(objectId, objectName, (callback) => {
            let datas = [];
            let fileExtension;
            callback.data.data && callback.data.data.length > 0 && callback.data.data.forEach((values) => {
                 fileExtension = values.file_name.split('.').pop().toLowerCase();
                if(fileExtension === 'm4a'){
                    datas.push({
                        name: values?.file_name,
                        uri: values?.url,
                        id: values?.id,
                        isOldRecord: true
                    });
                }
            });
            setRecordings(datas)
        });
    };

    const removeAudio = (id) => {
        if (id) {
            mediaService.deleteMedia(id, (error, response) => {
                getAudioList();
            });
        }
    }

    const playSoundEffect = async (soundUri) => {
        const { sound } = await Audio.Sound.createAsync(soundUri);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    };

    async function startRecording() {
        try {
            await playSoundEffect(require('../assets/audio/recording_start.mp3'))
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            let { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setRecordingTime(0);

            Animated.loop(
                Animated.sequence([
                    Animated.timing(recordingAnimation, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(recordingAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(graphAnimation, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(graphAnimation, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }),
                ])
            ).start();

            const intervalId = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
            setRecordingInterval(intervalId);
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    const uploadAudio = async (fileUri, name) => {
        await Media.uploadAudio(
            objectId,
            fileUri,
            name,
            objectName,
            null,
            (response) => {
                if (response) {
                    getAudioList();
                }
            }
        );
    };

    async function stopRecording() {
        try {
            
     
        if (recording) {
            await playSoundEffect(require('../assets/audio/recording_stop.mp3'))
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

            if (props?.isAddPage) {
                setRecordings([
                    ...recordings,
                    {
                        name: `ticket-${Date.now()}.m4a`,
                        recording: recording,
                    },
                ]);
                setAudioRecordings &&
                    setAudioRecordings([
                        ...recordings,
                        {
                            name: `ticket-${Date.now()}.m4a`,
                            recording: recording,
                        },
                    ]);
            } else {
                const fileUri = recording.getURI();
                await uploadAudio(fileUri, `ticket-${Date.now()}.m4a`);
            }
            setRecording(null);

            recordingAnimation.stopAnimation();
            graphAnimation.stopAnimation();
            clearInterval(recordingInterval);
            setRecordingInterval(null);
        }
    } catch (error) {
            console.log(error)
    }
    }

    async function handlePlayPause(index) {
        if (playing === index) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            let newSound;
            if (recordings[index]?.isOldRecord) {
                const { sound: oldSound, status } = await Audio.Sound.createAsync({
                    uri: recordings[index]?.uri,
                });
                newSound = oldSound
            } else {
                const { sound: localSound, status } = await recordings[index].recording.createNewLoadedSoundAsync({
                    isLooping: false,
                    isMuted: false,
                    volume: 1.0,
                    rate: 1.0,
                    shouldCorrectPitch: true,
                });
                newSound = localSound;
            }
            setSound(newSound);
            setPlaying(index);
            setIsPlaying(true);

            Animated.loop(
                Animated.sequence([
                    Animated.timing(playingAnimation, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(playingAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            await newSound.playAsync();
            newSound.setOnPlaybackStatusUpdate(async (status) => {
                setPlaybackStatus(status);
                if (status.didJustFinish) {
                    setPlaying(-1);
                    setIsPlaying(false);
                    await newSound.unloadAsync();
                    playingAnimation.stopAnimation();
                }
            });
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
                console.log("Unloaded Sound");
            }
            : undefined;
    }, [sound]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (

        <View style={styles.container}>
            <Label text={"Voice Notes"} size={15} bold={true} />
            <View style={styles.list}>
           {!ArrayList.isArray(recordings) && <NoRecordFound iconName="file-audio" paddingVertical={100} />}
                {ArrayList.isArray(recordings) && recordings.map((recording, index) => (
                    <View key={index} style={styles.recordingItem}>
                        <TouchableOpacity
                            onPress={() => handlePlayPause(index)}
                            style={styles.playButton}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        { scale: playing === index ? playingAnimation : 1 },
                                    ],
                                }}
                            >
                                <Ionicons
                                    name={isPlaying && playing === index ? "pause" : "play"}
                                    size={30}
                                    color="white"
                                />
                            </Animated.View>
                            <Text style={styles.recordingName}>
                                {playing === index
                                    ? playbackStatus
                                        ? `${formatTime(
                                            playbackStatus.positionMillis / 1000
                                        )} / ${formatTime(playbackStatus.durationMillis / 1000)}`
                                        : recording.name
                                    : recording.name}
                            </Text>
                            <Ionicons
                                name="trash"
                                size={30}
                                color="white"
                                onPress={() => {
                                    if (props?.isAddPage) {
                                        setRecordings(recordings.filter((rec, i) => i !== index));
                                    } else {
                                        removeAudio(recording?.id)
                                    }
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.controls}>
                <Pressable
                    style={styles.button}
                    onPress={recording ? stopRecording : startRecording}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.buttonText}>
                            {recording ? "Stop Recording" : "Start Recording"}
                        </Text>
                        {recording && (
                            <Text
                                style={[
                                    styles.recordingTimeText,
                                    { marginLeft: 15 },
                                ]}
                            >
                                {formatTime(recordingTime)}
                            </Text>
                        )}
                    </View>
                    {recording && (
                        <Animated.View
                            style={[
                                styles.recordingAnimation,
                                {
                                    transform: [{ scale: recordingAnimation }],
                                },
                            ]}
                        >
                            <Ionicons name="mic" size={20} color="red" />
                        </Animated.View>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        marginTop: 50,
        borderTopWidth: 1,
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    recordingItem: {
        marginBottom: 15,
        backgroundColor: "#333",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    controls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        margin: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    recordingTimeText: {
        color: "red",
        fontSize: 18,
    },
    recordingAnimation: {
        marginLeft: 10,
    },
    recordingName: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
        flex: 1,
        marginLeft: 10,
    },
    playButton: {
        flexDirection: "row",
        alignItems: "center",
    },
});
