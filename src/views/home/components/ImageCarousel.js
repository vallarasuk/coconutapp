import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import BgGradientColor from "../../../components/BgGradientColor";
import Color from "../../../lib/Color";

const { width: screenWidth } = Dimensions.get("window");


const renderItem = ({ item, index }) => {
    const { backgroundColor: bgColor, textColor } = Color.getRandomColor(index);
    return (
        <View style={[styles.slide, { backgroundColor: bgColor }]}>
        <Image source={{ uri: item.media_url }} style={styles.image} />
        {item?.title || item?.description ? (
            <View style={styles.textContainer}>
                {item?.title && <Text style={[styles.title, { color: textColor }]}>{item?.title}</Text>}
                {item?.description && <Text style={[styles.subtitle, { color: textColor }]}>{item?.description}</Text>}
            </View>
        ) : null}
    </View>
    );
};

const RenderImageCarousel = ({ carouselData }) => {

    const layoutList = ["slider", "stack", "tinder", "default"];

    const getRandomLayout = () => {
        const randomIndex = Math.floor(Math.random() * layoutList.length);
        return layoutList[randomIndex];
    };

    const selectedLayout = getRandomLayout();
    return (
        <View style={[styles.container]}>
            <View style={{
                minWidth: "100%",
            }}>
                {carouselData?.title && <LinearGradient
                    colors={["#8e9eab", "#eef2f3", "#eef2f3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 0 }}
                >
                    <View style={[styles.titleContainer]}>
                        <Text style={styles.titleText}>{carouselData?.title}</Text>
                    </View>
                </LinearGradient>}
            </View>
            <Carousel
                data={carouselData?.PageBlockFieldsListArray}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth * 1}
                layout={"slider"}
                autoplay={true}
                autoplayInterval={10000} 
                autoplayDelay={4000}
                loop={true}
                loopClonesPerSide={3} 
            />
        </View>
    );
};

const ImageCarousel = ({ imageBlockList }) => {

    return (
        <ScrollView>
            <BgGradientColor numOfColors={imageBlockList.length}>
                <View style={styles.mainContainer}>
                    {imageBlockList.map((data, index) => (
                        <RenderImageCarousel carouselData={data} />
                    ))}
                </View>
            </BgGradientColor>
        </ScrollView>

    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    slide: {
        backgroundColor: "white",
        minHeight: 500,
        height: 500,
    },
    image: {
        width: "100%",
        height: "70%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "left",
        color: "gray",
    },
    titleContainer: {
        backgroundColor: "linear-gradient(to right, #8e9eab 0%, #eef2f3 51%, #8e9eab 100%)",
        shadowColor: "#eee",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        marginLeft: 10
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "left",
    },
    textContainer: {
        paddingVertical: 20, 
        paddingHorizontal: 10, 
        flex: 1,
        justifyContent: "center",
    },
});

export default ImageCarousel;
