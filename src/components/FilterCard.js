import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserCard from './UserCard';
import styles from '../helper/Styles';
import { Color } from '../helper/Color';

const FilterCard = ({ data, handleDeleteFilter }) => {

  const handleRemoveFilter = (obj) => {
    let objectvalue = {};
    let key = Object.keys(obj)[0];
    objectvalue[key] = "";
    handleDeleteFilter && handleDeleteFilter(objectvalue);
  };

  return (
    <ScrollView horizontal style={styles.scrollView}>
      {data && data.length > 0 && data.map((item, index) => {
        const filteredKeys = Object.keys(item).filter(key => isNaN(item[key]));

        if (filteredKeys.length === 0) {
          return null;
        }

        return (
          <View style={styles.direction} key={index}>
            {filteredKeys.map((key, subIndex) => (
              <View style={styles.cardFilter} key={subIndex}>
                <View style={styles.cardFilterContent}>
                  {typeof item[key] === 'object' ? (
                   <UserCard firstName = {item?.userName?.name} image = {item?.userName?.image}/>
                  ) :  ( <Text style={styles.headline}>
                    {item[key]}  </Text>)}

                  <TouchableOpacity onPress={() => handleRemoveFilter({ [key]: item[key] })}>
                    <Icon name="times" size={15} color= {Color.BLACK} style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};



export default FilterCard;
