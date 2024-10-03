import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import UserCard from "./UserCard";
import styles from "../helper/Styles";
import DateText from "./DateText";
import systemLogService from "../services/SystemLogService";
import AlternativeColor from "./AlternativeBackground";
import ListCustomLoader from "./ListCustomLoader";
import { Color } from "../helper/Color";
import { FontAwesome5 } from "@expo/vector-icons";

const HistoryList = (props) => {
  const { objectId, objectName } = props;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyList();
  }, []);

  const historyList = async () => {
    setLoading(true);
    let param = { objectId: objectId, objectName: objectName };

    await systemLogService.getHistoryList(param, (error, response) => {
      if (!error) {
        setHistory(response.data.data);
      }
      setLoading(false);
    });
  };

  return (
    <View>
      {loading ? (
        <ListCustomLoader />
      ) : (
        <>
          {history && history.length > 0 ? (
            history.map((item, index) => {
              const containerStyle = AlternativeColor.getBackgroundColor(index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.historyContainer, containerStyle]}
                >
                  <View style={styles.leadContainer}>
                    <View style={styles.user}>
                      <View style={styles.cardAlign}>
                        <UserCard
                          firstName={item.first_name}
                          lastName={item.last_name}
                          size={20}
                          image={item.media_url}
                        />
                      </View>
                    </View>
                    <View>
                      {item.message && item.message.length > 0 && item.message.map((messageItem, messageIndex) => (
                        <Text style={styles.cardDate} key={messageIndex}>
                          {messageItem}
                        </Text>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ paddingVertical: 250, alignItems: "center" }}>
              <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
              <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default HistoryList;
