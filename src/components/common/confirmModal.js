import React, { Component } from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { ThemeText } from './';

const deleteIcon = require('../../images/delete.png');

class ConfirmModal extends Component {
    onToggle = (visible) => {
        this.props.onToggle(visible);
    }

    render() {
        return (
            <Modal
            animationType={this.props.animationType}
            transparent={this.props.transparent}
            visible={this.props.visible}
            onRequestClose={() => { }}
            >
                <View style={styles.miniModal}>
                    <View style={styles.miniModalView}>
                        <View style={styles.topModal}>
                            <View style={styles.titleModal}>
                                <Text style={styles.modalTitleText}>{this.props.title}</Text>
                            </View>
                            <TouchableOpacity 
                            activeOpacity={0.2}
                            onPress={this.onToggle.bind(this, false)}
                            style={styles.hideModal}
                            >
                                <Image
                                    style={{ height: 16, width: 16, opacity: 0.8 }}
                                    source={deleteIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#D0D6DE' }} />
                        {this.props.message ? <ThemeText style={{ fontSize: 12, padding: 20, textAlign: 'center' }}>{this.props.message}</ThemeText> : null}
                        {this.props.children}
                        <TouchableOpacity
                            onPress={this.props.onConfirm}
                            activeOpacity={0.8} style={[this.props.buttonColor, { height: 50, alignContent: 'center', justifyContent: 'center', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }]}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1, textAlign: 'center' }}>{this.props.confirmText}</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.8)'
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
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
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

export { ConfirmModal };
