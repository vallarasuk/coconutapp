import { Field, useFormikContext } from 'formik';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Label from './Label';
import { MaskedTextInput } from 'react-native-mask-text';

const CustomPhoneNumberInput = (props) => {
    let { id, name, label, placeholder, required, editable=true } = props;
    const { touched, errors } = useFormikContext();

    const validate = (value) => {
        let errorMessage;
        const inputLabel = label || placeholder;

        if ((!value || !value.trim()) && required) {
            errorMessage = inputLabel
                ? `${inputLabel} is required`
                : `required`;
        } else if (value && value.replace(/[^0-9]/g, '').length < 10) {
            errorMessage = inputLabel ? `Invalid ${inputLabel}` : "Invalid";
        }
        return errorMessage;
    }

    return (
        <Field name={name} validate={validate}>
            {({ field, form }) => (
                <View style={{ marginTop: 8 }}>
                    <View style={styles.label}>
                        {label && <Label text={label} bold={true} />}
                        {label && required && <Text style={{ color: 'red' }}>*</Text>}
                    </View>
                    <View style={[styles.inputContainer, {backgroundColor: editable ?  'white':"", borderColor: (form.errors && form.errors[name]) && "red", borderWidth: editable ? 1:0 }]}>
                        <MaskedTextInput
                            name={name || id}
                            id={id || name}
                            style={[styles.input,{color: !editable ? "black":""}]}
                            editable={editable}
                            placeholder={placeholder ? placeholder : `Enter ${label}`}
                            onChangeText={form.handleChange(field.name)}
                            onBlur={form.handleBlur(field.name)}
                            value={form.values[name]}
                            mask="(999) 999-9999"  // Mask for US phone number format
                            keyboardType="phone-pad"
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
export default CustomPhoneNumberInput;
