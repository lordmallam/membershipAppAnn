import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

const _ = require('lodash');

class Header extends Component {
    getActions = () => {
        if(this.props.action && this.props.icon){
            return(
                <View>
                    <TouchableOpacity onPress={this.props.action}>
                    <Text style={{ fontFamily: 'fa-solid', fontSize: 20, alignSelf: 'center', marginTop: 5, marginBottom: 5, color: '#99c7e0'}}>
                    {this.props.icon}
                    </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return(<View />);
    };

    render() {
        return (
            <View 
            style={{ 
            backgroundColor: '#fff', 
            flexDirection: 'row',
            borderColor: '#eeeeee',
            borderBottomWidth: 1,
            elevation: 3,
            padding: 6
            }}
            >
                <View 
                style={{ 
                flex: 1,
                justifyContent: 'center' }}
                >
                <TouchableWithoutFeedback
                onPress={this.props.openMenu}
                >
                <View>
                <Text style={{ fontFamily: 'fa-solid', fontSize: 25, alignSelf: 'center', marginTop: 5, marginBottom: 5, color: '#479ac8'}}>
                    &#xf0c9;
                </Text>
                </View>
                </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 7, justifyContent: 'center'}}>
                <Text style={{ alignSelf: 'center', color: '#479ac8', fontSize: 18 }}>{this.props.pageName}</Text>                
                </View>
                <View style={{ flex: 1 }}>
                {this.getActions()}
                </View>
                </View>
        );
    }
}

export { Header };
