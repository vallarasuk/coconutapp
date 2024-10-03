import Modal from "../../components/Modal";
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Color } from "../../helper/Color";
import { verticalScale } from "../../components/Metrics";
import TextArea from "../../components/TextArea";
import UserSelect from "../../components/UserSelect";
import VerticalSpace10 from "../../components/VerticleSpace10";

const CommentModal = ({ toggle, comment,modalVisible, selectedUser,title,setSelectedUser, values, confirmLabel, cancelLabel, control, ConfirmationAction, onChange }) => {
  const modalBody = (
    <ScrollView style={styles.scrollview}>
      <View style={styles.modalBody}>
        {comment && (
          <>
            <UserSelect
              label="User"
              selectedUserId={selectedUser}
              name={"user"}
              values={selectedUser}
              onChange={(value) => setSelectedUser(value)}
              control={control}
              placeholder="Select User"
            />
            <VerticalSpace10 />
          </>
        )}

        <TextArea
          title={"Comments"}
          name={"comment"}
          values={values && values.toString()}
          required={true}
          control={control}
          onInputChange={onChange}
          placeholder="Comment"
        />
      </View>
    </ScrollView>
  );

  return (
    <>
      <Modal
        title={title}
        modalBody={modalBody}
        toggle={toggle}
        modalVisible={modalVisible}
        button1Label={confirmLabel}
        button1Press={ConfirmationAction}
        button2Label={cancelLabel}
        button2Press={() => toggle()}
      />
    </>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
    scrollview: {
    height: "50%",
  },
  modalHeader: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: Color.BLACK,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  modalFooter: {
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    height: verticalScale(40),
    backgroundColor: "#fff",
  },
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: "#fff",
  },
  bodyText: {
    paddingLeft: 60,
  },
});
