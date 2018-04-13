import React from 'react';
import { View, Picker } from 'react-native';

const _ = require('lodash');

const Dropdown = (props) => {
const { background } = styles;

const buildList = () => {
    const listItems = [];
    let _tempList = props.list;
    if (props.order) {
        _tempList = _.orderBy(_tempList, 'label');
    }
    if (props.default) {
        listItems.push(<Picker.Item 
        label={props.default.label} 
        value={props.default.value} key={props.default.value} 
        />);
    }
    _tempList.forEach((rec) => {
        listItems.push(<Picker.Item 
        label={rec.label}
        value={rec.value} key={rec.value}
        />);
    });
    return listItems;
};

   return (
   <View style={background}>
        <Picker
        selectedValue={props.selectedValue}
        onValueChange={props.onValueChange}
        mode={props.mode}
        enabled={props.enabled}
        >
            {buildList()}
        </Picker>
   </View>
    );
}; 

const styles = {
    background: {
        backgroundColor: '#f5f5f5',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        elevation: 2,
        padding: 5
    }
};

export { Dropdown };
