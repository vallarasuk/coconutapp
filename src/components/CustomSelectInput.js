import { Field, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Label from './Label';

const CustomSelectInput = (props) => {
    const { id, name, label, required, editable = true, options = [], placeholder, onChange } = props;
    const {  errors } = useFormikContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [modalVisible, setModalVisible] = useState(false);

    const inputLabel = label;

    const handleSearch = (text) => {
        setSearchTerm(text);
        const filtered = options.filter(option => 
            option.label.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    return (
        <Field 
            name={name} 
            validate={value => ((!value && required) ? inputLabel ? `${label} is required` : "Required" : "")}>
            {({ field, form }) => (
                <View style={{ marginTop: 8 }}>
                    <View style={styles.label}>
                        {label && <Label text={label} bold={true} />}
                        {label && required && <Text style={{ color: 'red' }}>*</Text>}
                    </View>
                    <TouchableOpacity 
                        style={[styles.inputContainer, { 
                            backgroundColor: editable ? 'white' : "", 
                            borderColor: (form.errors && form.errors[name]) ? "red" : "gray", 
                            borderWidth: editable ? 1 : 0 
                        }]}
                        onPress={() => editable && setModalVisible(true)}
                    >
                        <Text style={styles.input}>
                            {field?.value ? options.find(option => option.value === field?.value)?.label : placeholder || `Select ${label}`}
                        </Text>
                        {editable && field?.value ? (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => {
                                    form.setFieldValue(field?.name, "");
                                    if (onChange) onChange("");
                                }}
                            >
                                <FontAwesome name="times-circle" size={20} color="gray" />
                            </TouchableOpacity>
                        ) : null}
                    </TouchableOpacity>
                    <View>
                        {(errors && errors[name]) && (
                            <Text style={styles.errorText}>{errors[name]}</Text>
                        )}
                    </View>

                    {/* Popup Modal for Searchable Picker */}
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableOpacity 
                            style={styles.modalOverlay} 
                            onPress={() => setModalVisible(false)}
                        >
                            <View style={styles.popupContainer}>
                                <TextInput 
                                    style={styles.searchBar}
                                    placeholder={`Search ${label}`}
                                    value={searchTerm}
                                    onChangeText={handleSearch}
                                />
                                <FlatList
                                    data={filteredOptions}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            style={styles.optionItem} 
                                            onPress={() => {
                                                form.setFieldValue(field?.name, item?.value);
                                                setModalVisible(false);
                                                setSearchTerm('');
                                                setFilteredOptions(options);
                                                if (onChange) onChange(item);
                                            }}
                                        >
                                            <Text>{item?.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            )}
        </Field>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        borderColor: 'gray',
        borderRadius: 8,
        minWidth: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 45, 
        justifyContent: 'space-between',
    },
    input: {
        fontSize: 16,
    },
    clearButton: {
        padding: 5,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
    },
    label: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    popupContainer: {
        width: '80%',
        maxHeight: '50%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    searchBar: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 8, 
        marginBottom: 10, 
    },
    optionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    closeButton: {
        marginTop: 15, 
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16, 
    },
});

export default CustomSelectInput;
