import React from 'react';
import {View } from 'react-native';
import Controllers from './Controller';
import Required from './Required';
import ErrorMessage from './error';
import InputText from './InputText';
import styles from '../helper/Styles';
const TextInput = ({
    control,
    name,
    placeholder,
    keyboardType,
    secureTextEntry,
    currency,
    required,
    title,
    editable=true,
    onInputChange,
    containerStyle,
    values,
    multiline,
    onContentSizeChange,
    underlineColorAndroid,
    maxLength,
    showBorder,
    textAlignVertical,
    placeHolderShow
}) => {
    return (
        <Controllers
            control={control}
            name={name}
            required={required}
            placeholder={placeholder}
        >
            {({ value, onChange, onBlur, error }) => (
                <>
                    <Required title={title} required={required} />
                    <InputText
                        currency={currency}
                        value={value}
                        values={values}
                        onBlur={onBlur}
                        editable={editable}
                        multiline={multiline}
                        placeholder={placeholder}
                        title={title}
                        placeHolderShow={placeHolderShow}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        onChange={onChange}
                        showBorder={showBorder}
                        onInputChange={onInputChange}
                        onContentSizeChange={onContentSizeChange}
                        underlineColorAndroid={underlineColorAndroid}
                        maxLength={maxLength}
                        textAlignVertical={textAlignVertical}
                        returnKeyType='done'
                    />
                    <ErrorMessage validate={error} placeholder={placeholder} title={title} />
                </>
            )}
        </Controllers>
    );
};
export default TextInput;
