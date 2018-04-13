import React, { Component } from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from '../common'

const deleteIcon = require('../../images/delete.png');

class SuccessModalView extends Component {

    render() {
        return (
            <Modal
            animationType={this.props.animationType}
            transparent
            visible={this.props.visible}
            onRequestClose={this.props.onRequestClose}
            >
                <View style={styles.miniModal}>
                    <View style={{ backgroundColor: '#73b650', width: 80, height: 80, borderRadius: 40,
                    elevation: 2, alignSelf: 'center', bottom: -50, justifyContent: 'center'}}>
                    <Text style={{ fontFamily: 'fa-solid', fontSize: 40, alignSelf: 'center', color: '#fff'}}>&#xf058;</Text>
                    </View>
                    <View style={styles.miniModalView}>
                        <View style={{ minHeight: 100 }}>
                        {this.props.children}
                        </View>                        
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = {
    maxModal: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'rgba(51,143,194,0.6)'
    },
    maxModalView: {
        flex: 1,
        margin: 30,
        backgroundColor: '#fff',
        borderRadius: 5
    },
    miniModal: {
        flex: 1,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(51,143,194,0.6)'
    },
    miniModalView: {
        flexGrow: 0,
        margin: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
        minWidth: 300,
        padding: 0
    },
    topModal: {
        height: 50,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between'
    },
    hideModal: {
        width: 50,
        height: 50,
        right: 0,
        top: 0,
        padding: 17,
        borderTopRightRadius: 5
    },
    titleModal: {
        flex: 1,
        height: 50,
        padding: 15
    }
};

export { SuccessModalView };
