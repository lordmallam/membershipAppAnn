import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import { Spinner } from './spinner';


class PageLoader extends Component {

onRequestClose() {
    //Reqired by modals
}

render() {
        return (
        <Modal
          transparent
          visible={this.props.visible}
          onRequestClose={this.onRequestClose}
        >
         <View 
         style={{ backgroundColor: 'rgba(0,0,0,0.7)',
          flex: 1,
          justifyContent: 'center' }}
         >    
        <Spinner />
        </View>
        </Modal>);
    }
}

export { PageLoader };