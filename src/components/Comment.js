import React, { useEffect, useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import asyncStorageService from "../services/AsyncStorageService";
import CommentService from "../services/CommentService";
import UserCard from "./UserCard";
import { Color } from "../helper/Color";
import DateTime from "../lib/DateTime";
import styles from "../helper/Styles";
import { FontAwesome } from "@expo/vector-icons";
import CommentModal from "../views/Ticket/commentModal";
import NoRecordFound from "./NoRecordFound";
import DeleteConfirmationModal from "./Modal/DeleteConfirmationModal";
import { useForm } from "react-hook-form";
import VoiceNoteRecorder from "./VoiceNoteRecorder";
import Label from "./Label";


const Comment = (props) => {
    let { objectId, objectName, assignee_id, commentModal = false, setCommentModal, showVoiceNoteRecorder = false, showUserSelect=true } = props;

    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState("")
    const [message, setMessage] = useState("")
    const [messageId, setMessageId] = useState("");
    const [selectedUser, setSelectedUser] = useState(assignee_id || "");
    const [commentId, setCommentId] = useState("");
    const [commentDeleteModalOpen, setCommentDeleteModalOpen] = useState(false)


    useEffect(() => {
        getComment()
    }, [objectId]);


    const preloadedValues = {
        assignee: assignee_id,
    }
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });


    const getComment = async () => {
        const userId = await asyncStorageService.getUserId()
        setUserId(userId)
        let param = {
            objectId: objectId,
            objectName: objectName
        }
        await CommentService.search(param, (response) => {
            if (response) {
                setComments(response.data.data);
            }
        })
    }

    const commentToggle = () => {
        setCommentModal(false);
        setMessage("")
        setMessageId("")
        reset({})
    }

    const commentDeleteModalToggle = () => {
        setCommentDeleteModalOpen(!commentDeleteModalOpen);
    }

    const extractUserIds = (users) => {
        if (users && users.length > 0) {
            const extractedIds = users.map(user => user.id);
            return extractedIds;
        }
        return;
    };

    const deleteComment = async () => {
        let data = {
            commentId: commentId,
        };
        await CommentService.delete(objectId, JSON.stringify(data), (error, response) => {
            getComment()
            setMessageId("")
            reset({})
        })
    }

    const addComment = async (values) => {
        let data = {
            message: values.comment.toString(),
            objectName: objectName,
            objectId: objectId,
            user: Array.isArray(values.user) ? values.user.map(user => user.value) : [values.user || selectedUser && selectedUser.value !== undefined ? selectedUser.value : assignee_id],
        }
        if (messageId) {
            await CommentService.update(messageId, data, (response) => {
                if (response) {
                    commentToggle()
                    getComment()
                    setMessageId("")
                    reset({})
                }
            })
        }
        else {
            await CommentService.create(objectId, data, (error, response) => {
                if (response && response.data) {
                    commentToggle()
                    getComment()
                    setMessageId("")
                    reset({})

                }
            })
        }

    }

    return (
        <>
            <DeleteConfirmationModal
                modalVisible={commentDeleteModalOpen}
                toggle={commentDeleteModalToggle}
                item={commentId}
                updateAction={deleteComment}
                id={commentId}

            />
            <ScrollView>
            <Label text={"Commets"} size={15} bold={true} marginBottom={10} />
                {comments && comments.length > 0 ? comments.map((comment, index) => {
                    return (
                        <View style={styles.card} key={index}>
                            <View style={styles.commentUserInfo}>
                                <UserCard
                                    firstName={comment.first_name}
                                    lastName={comment.last_name}
                                    showFullName={false}
                                    image={comment.media_url}
                                />
                                <Text style={styles.userNameComment}>

                                    {comment.first_name} {comment.last_name} &nbsp;
                                    <Text style={{ color: Color.ACTIVE }}>updated {DateTime.TimeNow(comment.timestamp)}</Text>
                                </Text>
                            </View>
                            {comment.users && comment.users.map((user, index) => {

                                return (
                                    <View key={index}>
                                        <UserCard
                                            firstName={user.first_name}
                                            lastName={user.last_name}
                                            showFullName={true}
                                            image={user.media_url}
                                        />
                                    </View>
                                );
                            })}
                            <View style={styles.direction}>
                                <View style={styles.commentMessageContainer}>
                                    <Text style={styles.commentMessage}>{comment?.message && Array.isArray(comment?.message) ? comment?.message.join() : comment?.message}</Text>
                                </View>
                                {comment.userId == userId && (

                                    <View style={styles.commentActionsContainer}>
                                        <TouchableOpacity
                                            style={styles.commentActionIconContainer}
                                            onPress={() => {
                                                setMessageId(comment.id)
                                                setMessage(comment.message && Array.isArray(comment.message) ? comment.message.join() : comment.message)
                                                setCommentModal(true)
                                                const userIds = extractUserIds(comment.users); // Extract user IDs
                                                setSelectedUser(userIds[0]);

                                            }}
                                        >
                                            <FontAwesome name="edit" size={20} color="black" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.commentActionIconContainer}
                                            onPress={() => {
                                                setCommentDeleteModalOpen(true)
                                                setCommentId(comment.id)
                                            }}
                                        >
                                            <FontAwesome name="trash" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </View>
                        </View>
                    );
                }) : <NoRecordFound iconName="receipt" paddingVertical={100} />
                }
                <CommentModal
                    toggle={commentToggle}
                    modalVisible={commentModal}
                    title={messageId ? "Edit Comment" : "Add Comment"}
                    confirmLabel={messageId ? "Save" : "Add"}
                    cancelLabel={"Cancel"}
                    ConfirmationAction={handleSubmit((values) => addComment(values))}
                    control={control}
                    values={message}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                    comment={showUserSelect}
                    onChange={(value) => setMessage(value)}
                />

                {showVoiceNoteRecorder && <VoiceNoteRecorder
                    objectId={objectId}
                    objectName={objectName}
                />}
            </ScrollView>
        </>
    )
}

export default Comment;
