import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
const { buttonDefault, textStyle } = styles;

   return (
   <TouchableOpacity 
   style={[buttonDefault, props.style, props.disabled ? { backgroundColor: '#d2d2d2' } : {}]} 
   onPress={props.onPress}
   disabled={props.disabled}
   >
        <Text style={[textStyle, props.textStyle]}>{props.Text}</Text>
    </TouchableOpacity>
    );
}; 

const styles = {
    buttonDefault: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#0061c2',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: '#fff',
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 16
    }
};

export { Button };
