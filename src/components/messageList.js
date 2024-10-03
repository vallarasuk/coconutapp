// Import React and Component
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Button,
    TouchableOpacity,
    Text,
    ScrollView
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

import MessageService from "../services/MessageService";

import AlternativeColor from "./AlternativeBackground";
import MessageCard from "../views/Messages/MessageCard";
import NoRecordFound from "./NoRecordFound";

const MessageList = (props) => {
    const { onPress } = props

    const [userList, setUserList] = useState([]);

    const isFocused = useIsFocused();

    // render the inventory list function
    useEffect(() => {
        getMessageList();
    }, [isFocused]);

const readMessage = async (id,receiverId) =>{
    await MessageService.update(id,receiverId,(response)=>{
    })
    
}

    const getMessageList = () => {
        // Create a new array
        let messagerList = new Array();
        MessageService.search((error, response) => {
            let responseData = response.data.data;
            // Extract unique receiver IDs
            const receiverIds = responseData.map((item) => item.id);
            // Remove duplicates using Set and convert it back to an array
            const uniqueReceiverIds = Array.from(new Set(receiverIds));
            if (uniqueReceiverIds && uniqueReceiverIds.length > 0) {
                for (let i = 0; i < uniqueReceiverIds.length; i++) {
                    // Find the corresponding receiver object in responseData
                    const receiver = responseData.find(
                        (item) => item.id == uniqueReceiverIds[i]
                    );
                    messagerList.push({
                        firstName: receiver.first_name,
                        lastName:receiver.last_name,
                        id: receiver.id,
                        media_url: receiver.media,
                        recent_last_message: receiver.recent_last_message,
                        last_message_time: receiver.recent_message_timestamp,
                        read_at : receiver.read_at,
                        recieverMessageId : receiver.recieverMessageId,
                    });
                }
                setUserList(messagerList);
            }
        });
    };


    return (
        <ScrollView keyboardShouldPersistTaps="handled">
                    <View>

                        {userList &&
                            userList.length > 0 ?
                            userList.map((item, index) => {
                                const containerStyle = AlternativeColor.getBackgroundColor(index)
                                return (
                                    <MessageCard 
                                    firstName={item.firstName}
                                    lastName={item.lastName}
                                    message={item.recent_last_message}
                                    time={item.last_message_time}
                                    onPress={(e) => {
                                        onPress(item); 
                                        readMessage(item.id,item.recieverMessageId); 
                                      }}
                                    alternative={containerStyle}
                                    media={item.media_url}
                                    />
                                        
                                )
                            }) : <NoRecordFound iconName={"receipt"} message ={"No Messages Found"} />}
                    
                 </View>

        </ScrollView>



    );
};

export default MessageList;

