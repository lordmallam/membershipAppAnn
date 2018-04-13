import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Card = (props) => {
const { buttonDefault, textStyle } = styles;

   return (
   <TouchableOpacity 
   onPress={props.onPress}
   disabled={props.disabled}
   >
   <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: '#fff', elevation: 2, margin: 10 }}>
   <View style={{ width: 10, backgroundColor: props.color || '#73b650' }}></View>
    <View style={{ flex: 9, padding: 15 }}>
    <Text style={{ fontFamily: 'fa-solid', fontSize: 20, alignSelf: 'center', marginBottom: 15, color: props.color }}>
    {props.icon}</Text>
    <Text style={{ fontSize: 14, alignSelf: 'center', fontWeight: 'bold' }}>{props.text}</Text>
    </View>
   </View>
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

export { Card }