import React from 'react';
import { TextInput } from 'react-native';

const TextBox = (props) => {
const style = props.style;

if (style) {
if (!style.paddingLeft) {
    style.paddingLeft = 10;
}
if (!style.paddingRight) {
    style.paddingRight = 10;
}
}

return (
    <TextInput
        placeholder={props.placeholder}
        placeholderTextColor='#CCC'
        underlineColorAndroid='transparent'
        keyboardType={props.keyboardType}
        style={props.style}
        secureTextEntry={props.isSecure}
        onChangeText={props.onChangeText}
        onChange={props.onChange}
        onEndEditing={props.onEndEditing}
        value={props.value}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        editable={props.editable}
    />
);
};

export { TextBox };
