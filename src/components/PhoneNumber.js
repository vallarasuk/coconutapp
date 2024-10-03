import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';
import ErrorMessage from './error';
import Required from './Required';
import { formatMobileNumber } from '../lib/Format';
import styles from '../helper/Styles';
import { Color } from '../helper/Color';

const PhoneNumber = ({
    control,
    name,
    placeholder,
    currency,
    required,
    title,
    editable = true,
    values,
    onInputChange,
    maxLength
}) => {


    return (
        <>
            <Controller
                control={control}
                name={name}
              
                rules={{
                    required: required ? `Enter ${title}` : false,
                    pattern: {
                        value: /^\(\d{3}\) \d{3}-\d{4}$/,
                        message: `Invalid ${title}`,
                    },
                  }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                        <Required title={title} required={required} />

                        <View
                            style={[
                                styles.textContainer,
                                { borderColor: 'gray', borderWidth: currency ? 0 : !editable ? 0: 1 },
                            ]}
                        >
                            <TextInput
                                value={(value || values) && formatMobileNumber(value || values)}
                                onBlur={onBlur}
                                maxLength={maxLength}
                                editable={editable}
                                placeholder={placeholder || title}
                                placeholderTextColor = {Color.PLACEHOLDER_TEXT}
                                style={styles.textInputStyle}
                                onChangeText={(e) => {
                                    onChange(onInputChange && onInputChange(e) || formatMobileNumber(e));
                                }}
                                underlineColorAndroid="transparent"
                                keyboardType="phone-pad"
                                returnKeyType={"done"} 
                            />
                        </View>
                        {error && <ErrorMessage placeholder={placeholder} title={title} error={error} />}
                    </>
                )}
            />
        </>
    );
};

export default PhoneNumber;


