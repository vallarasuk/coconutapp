import React from 'react';
import AlertMessage from '../../helper/AlertMessage';
import CustomAlertModal from '../CustomAlertModal';
import { Label } from '../../helper/Label';

function DeleteConfirmationModal({ toggle, modalVisible,updateAction, id, name, date, userName }) {
    return (
        <CustomAlertModal
        visible={modalVisible}
        title="Delete Confirmation"
        message = {`${AlertMessage.DELETE_MODAL_DESCRIPTION} ${id ? id : name ? name : `${date}-(${userName})`}`}
        buttonOptions={[
        { label: Label.TEXT_YES, onPress: () => {updateAction(),toggle()} },
        { label: Label.TEXT_NO, onPress: () => toggle() }
        ]}
        />
    );
}

export default DeleteConfirmationModal;

