import React from 'react';
import styles from '../helper/Styles';
import { View, Text } from 'react-native';
import { Color } from '../helper/Color';

const StatisticsCountCard = (props) => {
  let { count, countLabel, backgroundColor } = props;
  return (
    <View
      style={[
        styles.countContainer,
        styles.halfWidth,
        {
          marginRight: 5,
          backgroundColor: backgroundColor ? backgroundColor : Color.INDIGO,
        },
      ]}
    >
      <View style={styles.centeredContent}>
        <Text style={styles.largeText}>{count}</Text>
      </View>
      <View style={styles.centeredContent}>
        <Text style={styles.countLabel}>{countLabel}</Text>
      </View>
    </View>
  );
};

export default StatisticsCountCard;
