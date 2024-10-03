import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Controllers from './Controller';
import Required from './Required';
import ErrorMessage from './error';

const Text = ({
    placeholder,
    name,
    value,
    secureTextEntry,
    showSoftInputOnFocus,
    keyboardType,
    hideBorder,
    paddingVertical,
    control,
    required,
    title,
    editable,
    containerStyle,
    values,
    multiline,
    onContentSizeChange,
    underlineColorAndroid,
    maxLength,
    showBorder,
    textAlignVertical,
    onChange,
    onInputChange,
    height
}) => {

    return (
        <View style={{ paddingVertical: paddingVertical ? paddingVertical : 10 }}>
            {control ? (
                <>
                    <Controllers
                        control={control}
                        name={name}
                        required={required}
                        placeholder={placeholder}
                    >
                        {({ value, onChange, onBlur, error }) => (
                            <>
                                <Required title={title} required={required} />
                                <View style={styles.container}>
                                    <TextInput
                                        value={value}
                                        values={values}
                                        onBlur={onBlur}
                                        editable={editable}
                                        multiline={multiline}
                                        placeholder={placeholder}
                                        title={title}
                                        style={[styles.input, { height: height}]}
                                        containerStyle={containerStyle}
                                        secureTextEntry={secureTextEntry}
                                        keyboardType={keyboardType}
                                        onChangeText={(e) => {
                                            onChange(e);
                                            onInputChange && onInputChange(e);
                                        }}
                                        showBorder={showBorder}
                                        onContentSizeChange={onContentSizeChange}
                                        underlineColorAndroid={underlineColorAndroid}
                                        maxLength={maxLength}
                                        textAlignVertical={textAlignVertical}
                                        returnKeyType='done'
                                    />
                                </View>
                                <ErrorMessage validate={error} placeholder={placeholder} title={title} />
                            </>
                        )}
                    </Controllers>
                </>

            ) : (
                <TextInput
                    showSoftInputOnFocus={showSoftInputOnFocus ?? true}
                    name={name}
                    style={[styles.input, hideBorder && styles.noBorder]}
                    onChangeText={onChange}
                    value={value}
                    placeholder={placeholder}
                    keyboardType={keyboardType ? keyboardType : "default"}
                    secureTextEntry={secureTextEntry}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        color: "black",
        height: 50,
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#dadae8",
    },
    noBorder: {
        borderWidth: 0,
        minWidth: "100%",
        width:"100%",
    },
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'gray',
        borderRadius: 8,
    },
});

export default Text;