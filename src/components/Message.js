import React, { useState, useEffect } from 'react';
import { Color } from '../helper/Color';
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import styles from '../helper/Styles';
import messageService from '../services/MessageService';
import Refresh from './Refresh';

const Message = (props) => {
  const [totalCount, setTotalCount] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    getMessageCount();
  }, [props]);
  useEffect(() => {
    getMessageCount();
  }, []);

  const handleMessagePress = () => {
    navigation.navigate("Messages");
  };

  const getMessageCount = () => {
    messageService.search((error, response) => {
      setTotalCount(response && response?.data && response?.data?.totalMessageCount);
    });
  };

  const route = useRoute();
  const routeNameArray = route.name.split('/');
  const menuItemValue = routeNameArray[0];

  return (
    <TouchableOpacity onPress={handleMessagePress} >

      <View style={{ alignItems: "center", position: 'relative' }}>
        <FontAwesome5
          name="envelope"
          size={30}
          color={ Color.MESSAGE_TEXT }
        />
        {!totalCount == 0 ? (
          <View style={styles.totalCounts}>
            <View style={styles.circle}>
              <Text style={{ color: 'white' }}>{totalCount}</Text>
            </View>
          </View>
        ) : ""}
      </View>
    </TouchableOpacity>
  );
};

export default Message;


