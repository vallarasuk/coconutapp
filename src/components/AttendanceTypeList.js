import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Color } from "../helper/Color";
import { Divider } from "react-native-paper";

function LeaveApplyModel({
  toggle,
  modalVisible,
  title,
  list, // List of items to display
  onPressItem, // Function to handle item press
}) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000099",
    },
    modalContainer: {
      width: "80%",
      height: "70%", // Adjust height as needed
      borderRadius: 5,
      backgroundColor: "#f9fafb",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: Color.LIGHT_GRAY,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: Color.PRIMARY,
    },
    subtext: {
      fontSize: 14,
      color: Color.RED,
      flexDirection: "row",
      paddingHorizontal: 20,
    },
    closeButton: {
      padding: 5,
    },
    itemContainer: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: Color.LIGHT_GRAY,
    },
    iconTextContainer: {
      flexDirection: "row", // Align icon and text in a row
      alignItems: "center",
      marginBottom: 5, // Space between text rows
    },
    icon: {
      marginRight: 10, // Space between icon and text
    },
    itemText: {
      fontSize: 14,
      color: Color.PRIMARY,
    },
    disabledText: {
      fontSize: 14,
      color: Color.LIGHT_GREY1,
    },
  });

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        toggle && toggle();
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={() => toggle && toggle()}
              style={styles.closeButton}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View>
              {list &&
                list.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.itemContainer}
                    onPress={() => onPressItem(item)}
                    disabled={!item.isEnabled} // Disable TouchableOpacity if item is not enabled
                  >
                    <View>
                      <View style={styles.iconTextContainer}>
                        <Text
                          style={
                            item.isEnabled ? styles.title : styles.disabledText
                          }
                        >
                          {item.name}{" "}
                        </Text>

                        {!item.isEnabled && (
                          <Text style={!item.isEnabled && styles.subtext}>
                            {item.warningMessage}
                          </Text>
                        )}
                      </View>
                      {item.description && (
                        <View style={styles.iconTextContainer}>
                          <MaterialCommunityIcons
                            name="information"
                            size={20}
                            color="#000"
                            style={styles.icon}
                          />
                          <Text
                            style={
                              item.isEnabled
                                ? styles.itemText
                                : styles.disabledText
                            }
                          >
                            {item.description}
                          </Text>
                        </View>
                      )}
                      {item.leaveTypeNote && (
                        <View style={styles.iconTextContainer}>
                          <MaterialCommunityIcons
                            name="information"
                            size={20}
                            color="#000"
                            style={styles.icon}
                          />
                          <Text
                            style={
                              item.isEnabled
                                ? styles.itemText
                                : styles.disabledText
                            }
                          >
                            {item.leaveTypeNote}
                          </Text>
                        </View>
                      )}
                      <Divider />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default LeaveApplyModel;
