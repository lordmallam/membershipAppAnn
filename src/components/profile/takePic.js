import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { RNCamera } from 'react-native-camera'
import { MainMenu, Button, Card, Header, ModalView } from '../common'
import AuthActions from '../../actions/auth'

const { updateUser, updateMember } = AuthActions;

class TakePic extends Component {

    state = {
        cameraSide: RNCamera.Constants.Type.front
    };

    switchCamera = () => {
        if(this.state.cameraSide === RNCamera.Constants.Type.front) {
            this.setState({ cameraSide: RNCamera.Constants.Type.back});
        } else {
            this.setState({ cameraSide: RNCamera.Constants.Type.front});
        }
    };

    capture = async () => {
        if (this.camera) {
            const options = { quality: 0.3, base64: true, forceUpOrientation: true, fixOrientation: true,
                mirrorImage: this.state.cameraSide === RNCamera.Constants.Type.front };
            try {
                const data = await this.camera.takePictureAsync(options)
                const base64 = new Buffer(data.base64, 'base64')
                const finalbase64 = base64.toString('base64')
                const memberWithPic = {...this.props.member}
                memberWithPic._attachments = {};
                memberWithPic._attachments['profile-pic.png'] = { data: finalbase64, content_type: 'image/png' }
                this.props.updateMember(memberWithPic)
                .catch(err => console.log(err))
                Actions.pop();
            } catch (error) {
                ToastAndroid.showWithGravity('An error occured while taking the picture.', 
            ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            }
            
        }
    };

    goBack = () => {
        Actions.pop();
    };

    onCameraMountError = e => {
        console.log('Error mounting camera', e);
    };


    render() {
        return(
            <View style={this.style.miniModal}>
            <View style={{ backgroundColor: '#fff', elevation: 3 }}>
            <View style={{ width: 250, height: 250 }}>
            <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
            type={this.state.cameraSide}
            flashMode={RNCamera.Constants.FlashMode.auto}
            ratio = '1:1'
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.switchCamera}>
            <Text style={{ fontFamily: 'fa-solid', fontSize: 30, alignSelf: 'center'}}>&#xf079;</Text>
            </TouchableOpacity>
            </View>
            <View style={{flex: 2, justifyContent: 'center'}}>
            <TouchableOpacity onPress={this.capture}>
            <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: '#fff',
            alignSelf: 'center', justifyContent: 'center'}}> 
            <Text style={{ fontFamily: 'fa-solid', fontSize: 30, alignSelf: 'center', color: '#39759b'}}>&#xf030;</Text>           
            </View>
            </TouchableOpacity>
            </View>            
            <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={this.goBack}>
            <Text style={{ fontFamily: 'fa-solid', fontSize: 25, alignSelf: 'center'}}>&#xf410;</Text>
            </TouchableOpacity>
            </View>
            </View>
            </View>
            </View>
        );
    }

    style = {
        miniModal: {
            flex: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(51,143,194,0.6)'
        }
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    member: state.auth.member
});
  
export default connect(mapStateToProps, { updateUser, updateMember })(TakePic);

