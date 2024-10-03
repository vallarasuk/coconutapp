import { Dimensions, Platform } from 'react-native';

export const keyboardVerticalOffset = () => {
  const { height } = Dimensions.get('window');
  let keyboardVerticalOffset = Platform.OS === 'ios' ? -150 : -150;

  if (height > 800) {
    keyboardVerticalOffset = Platform.OS === 'ios' ? -100 : -100;
  }

  return keyboardVerticalOffset;
};
