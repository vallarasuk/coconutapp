import { Field, useFormikContext } from 'formik';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Label from './Label';

const CustomTextInput = (props) => {
    let { id, name, label, placeholder, required, editable=true } = props;
    const { touched, errors } = useFormikContext();

    let inputLabel = label || placeholder;
    return (
        <Field name={name} validate={value => ((!value && required) ? inputLabel ? `${label} is required` : "Required" : "")}>
            {({ field, form }) => (

                <View style={{marginTop:8}}>
                    <View style={styles.label}>
                        {label && <Label text={label} bold={true} />}
                        {label && required && <Text style={{ color: 'red' }}>*</Text>}
                    </View>
                    <View style={[styles.inputContainer, {backgroundColor: editable ?  'white':"", borderColor: (form.errors && form.errors[name]) && "red", borderWidth: editable ? 1:0,borderRadius:8, borderColor: 'gray' }]}>
                        <TextInput
                            name={name || id}
                            id={id || name}
                            style={[styles.input,{color: !editable ? "black":""}]}
                            editable={editable}
                            placeholder={placeholder ? placeholder : `Enter ${label}`}
                            onChangeText={form.handleChange(field.name)}
                            onBlur={form.handleBlur(field.name)}
                            value={field?.value}
                        />
                    </View>
                    <View>
                        {(errors && errors[name] && errors[name] !== undefined) && (
                            <Text style={styles.errorText}>{errors[name]}</Text>
                        )}
                    </View>
                </View>
            )}
        </Field>
    )
}

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
        minHeight: 50,
        paddingLeft: 10
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
    },
    label: {
        flexDirection: 'row', marginBottom: 3
    },
});
export default CustomTextInput
