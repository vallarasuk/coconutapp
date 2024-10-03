import { Dimensions, PixelRatio, StyleSheet } from 'react-native';

let { height } = Dimensions.get('window');
let { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  viewOuter: {
    flexDirection: 'row',
  },
  viewBtnLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'white',
    paddingTop :2,
    height: PixelRatio.roundToNearestPixel((height * 6) / 100),
    width: PixelRatio.roundToNearestPixel((width * 10) / 100),
    borderTopLeftRadius: PixelRatio.roundToNearestPixel((height * 1) / 100),
    borderBottomLeftRadius: PixelRatio.roundToNearestPixel((height * 1) / 100),
  },
  viewBtnRight: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    fontSize: 18,
    borderColor: 'white',
    height: PixelRatio.roundToNearestPixel((height * 6) / 100),
    width: PixelRatio.roundToNearestPixel((width * 10) / 100),
    borderTopRightRadius: PixelRatio.roundToNearestPixel((height * 1) / 100),
    borderBottomRightRadius: PixelRatio.roundToNearestPixel((height * 1) / 100),
  },
  viewTextInput: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'white',
    height: PixelRatio.roundToNearestPixel((height * 6) / 100),
    width: PixelRatio.roundToNearestPixel((width * 10) / 100),
  },
  labelStyle: {
    fontSize: 16,
  },
  decreamentStyle : {
    fontSize:22,
    paddingBottom:10
  }
});
export default styles;