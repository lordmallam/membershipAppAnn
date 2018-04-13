import React, { Component } from 'react';
import { View, DrawerLayoutAndroid, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import PouchDB from 'pouchdb-react-native';
import Config from '../../config';
import { PouchOps } from '../../utils/pouchdb';

let width = Dimensions.get('window').width;

class MainMenu extends Component {

    onHome() {
        this.refs[this.props.id].closeDrawer();
        Actions.popTo('home');
    }

    onContact() {
        this.refs[this.props.id].closeDrawer();
            Actions.contact();
    }

    onLogout() {
        this.refs[this.props.id].closeDrawer();
        Actions.auth({ type: ActionConst.RESET });
    }

    getUsername() {
        if (this.props.info.user) {
            if (this.props.info.user.doc) {
                return this.props.info.user.doc.name;
            }
        }
        return '';
    }

    render() {
        const navigationView = (
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}>
            <View>
                 
            <Text 
            style={{ 
            fontSize: 15, 
            textAlign: 'left', 
            color: '#fff', 
            marginBottom: 20,
            backgroundColor: '#338fc2',
            paddingLeft: 10,
            paddingTop: 15,
            paddingBottom: 15
         }}
            >
            Menu
            </Text>
            <TouchableOpacity 
            style={Styles.menuItem}
            onPress={this.onHome.bind(this)}
            >
            <Text style={Styles.menuIcon}>&#xf015;</Text> 
                <Text style={Styles.menuItemText}>Home</Text>
            </TouchableOpacity>            
            <TouchableOpacity 
            style={Styles.menuItem}
            onPress={this.onContact.bind(this)}
            >
                <Text style={Styles.menuIcon}>&#xf095;</Text>  
                <Text style={Styles.menuItemText}>Contact Us</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={Styles.menuItem}
            onPress={this.onLogout.bind(this)}
            >
                <Text style={Styles.menuIcon}>&#xf2f5;</Text> 
                <Text style={Styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ color: '#adcad7', alignSelf: 'center' }}>Copyright ANN, 2018</Text>
                <Text style={{ color: '#adcad7', alignSelf: 'center' }}>{Config.resources.appName}</Text>
                <Text style={{ color: '#adcad7', alignSelf: 'center' }}>{Config.resources.version}</Text>
            </View>
            </View>
        );

        return (
        <DrawerLayoutAndroid
        drawerWidth={250}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        keyboardDismissMode='on-drag'
        ref={this.props.id}
        >
        <View style={{ flex: 1 }}>
            {this.props.children}
        </View>
        </DrawerLayoutAndroid>
        );
    }
}

const Styles = {
    menuItem: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
        marginBottom: 5,
        backgroundColor: '#fff',
        borderBottomColor: '#f6f6f6',
        borderBottomWidth: 1
    },
    menuItemText: {
        color: '#6c6c6c',
        paddingLeft: 25,
        fontSize: width / 26
    },
    infoText: {
        fontSize: 12,
        color: '#adcad7',
        fontStyle: 'normal'
    },
    menuIcon: {
        position: 'absolute',
        top: 16,
        left: 10,
        color: '#106fa4',
        fontFamily: 'fa-solid', 
        fontSize:  16
    },
    menuIconTop: {
        position: 'absolute',
        top: 16,
        right: 10
    }
};

export { MainMenu };
