import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import PouchDB from 'pouchdb-react-native';
import { RNCamera } from 'react-native-camera'
import { MainMenu, Button, Card, Header, ModalView } from '../common'
import AuthActions from '../../actions/auth'
import { getSystemDataById } from '../../utils';
import Config from '../../config';

const { updateUser, updateMember } = AuthActions;
const localAppDB = new PouchDB(Config.db.localDB_AppData, {adapter: 'asyncstorage'});

class Profile extends Component {

    state = {
        picMarkUp: null,
        lga: ''
    };

    componentDidMount() {
        this.getLGA(this.props.member.lga);
        if(this.props.member._attachments && this.props.member._attachments['profile-pic.png'].data !== '') {
            this.getProfilePic(this.props.member._attachments['profile-pic.png'].data)
        } else {
            this.getProfilePicFromWeb(this.props.member._id)
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.member._attachments && newProps.member._attachments['profile-pic.png'] &&
        newProps.member._attachments['profile-pic.png'].data) {
            const imageProcessed = newProps.member._attachments['profile-pic.png'].data
            this.getProfilePic(imageProcessed);
        }
        this.getLGA(newProps.member.lga);
    }

    getProfilePicFromWeb = memberId => {
        const URL = `${Config.environmentAuthority.apiUrl}members/image/${memberId}`
        fetch(URL, {
            method: 'GET',
            mode: 'cors'
          })
          .then(res =>(res.json()))
        .then(res => {
            if(res && res.image) {
                const memberWithPic = {...this.props.member}
                memberWithPic._attachments['profile-pic.png'].data = res.image
                this.props.updateMember(memberWithPic)
            } else {
                this.getProfilePic()
            }
        })
        .catch(err => {
            console.log('Could not get profile picture')
        })

    };

    openMenu = () => {
        this.refs.menu.refs.mainMenu.openDrawer();
    };

    editProfile = () => {
        Actions.editProfile();
    };

    goToTakePic = () => {
        Actions.takepic();
    };

    getLGA = (id) => {
        getSystemDataById(id)
        .then(res => {this.setState({lga: res.name})})
        .catch(err => {this.setState({lga: err})});
    };

getProfilePic = img => {
    if(img) {
        this.setState({
            picMarkUp: (<Image source={{uri: `data:image/png;base64,${img}`}}
            style={{ width: 100, height: 100, alignSelf: 'center' }} />)
        });
    }
    else {
        this.setState({
            picMarkUp: (<View>
                        <Text style={{ fontFamily: 'fa-solid', fontSize: 50, alignSelf: 'center', marginTop: 15, marginBottom: 5, color: '#5a9b39'}}>
                        &#xf007;
                        </Text>
                        <Text style={{ fontFamily: 'fa-solid', fontSize: 20, alignSelf: 'center', margin: 2, color: '#39759b'}}>
                        &#xf030;
                        </Text>
                        </View>)
        });
    }
};

  render() {
    return (
        <MainMenu 
            id={'mainMenu'}
            ref={'menu'}
            info={{ user: this.props.user }}
        >
        <Header pageName='My Profile' openMenu={this.openMenu} icon='&#xf044;' action={this.editProfile}/>
        <ScrollView style={{ flex: 1}}>
            <View>
                <TouchableOpacity style={{ backgroundColor: '#fff', width: 100, height: 100, 
                borderRadius: 50, elevation: 5, marginTop: 30, alignSelf: 'center', overflow: 'hidden'}}
                onPress={this.goToTakePic}>
                {this.state.picMarkUp}
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3a6a75', alignSelf: 'center', marginTop: 20}}>
                {this.props.member.firstname} {this.props.member.surname}</Text>
                <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: 5}}>
                {this.props.member.memberId}</Text>
                <View style={{ paddingTop: 10, paddingBottom: 10, margin: 20,
                backgroundColor: '#fff', borderRadius: 10}}>
                <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                    <Text style={{color: '#69abd0', flex: 2}}>Sex:</Text>
                    <Text style={{ flex: 3}}>{this.props.member.sex}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                    <Text style={{color: '#69abd0', flex: 2}}>Date of Birth:</Text>
                    <Text style={{ flex: 3}}>{moment(this.props.member.dateOfBirth).format('DD MMMM, YYYY')}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                    <Text style={{color: '#69abd0', flex: 2}}>Email:</Text>
                    <Text style={{ flex: 3}}>{this.props.member.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                    <Text style={{color: '#69abd0', flex: 2}}>Local Govt.:</Text>
                    <Text style={{ flex: 3}}>{this.state.lga}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15 }}>
                    <Text style={{color: '#69abd0', flex: 2}}>Address:</Text>
                    <Text style={{ flex: 3}}>{this.props.member.residenceAddress}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15 }}>
                    <Text style={{color: '#69abd0', flex: 2}}>Phone:</Text>
                    <Text style={{ flex: 3}}>{this.props.member.phone}</Text>
                </View>
                </View>
                <View>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#3a6a75', alignSelf: 'center', marginTop: 10 }}>Next of Kin</Text>
                </View>
                {this.props.member.nok ? (
                    <View style={{ paddingTop: 10, paddingBottom: 10, margin: 20,
                        backgroundColor: '#fff', borderRadius: 10}}>
                        <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                            <Text style={{color: '#69abd0', flex: 2}}>Name:</Text>
                            <Text style={{ flex: 3}}>{this.props.member.nok.firstname} {this.props.member.nok.surname}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                            <Text style={{color: '#69abd0', flex: 2}}>Sex:</Text>
                            <Text style={{ flex: 3}}>{this.props.member.nok.sex}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                            <Text style={{color: '#69abd0', flex: 2}}>Date of Birth:</Text>
                            <Text style={{ flex: 3}}>{moment(this.props.member.nok.dateOfBirth).format('DD MMMM, YYYY')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                            <Text style={{color: '#69abd0', flex: 2}}>Phone:</Text>
                            <Text style={{ flex: 3}}>{this.props.member.nok.phone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15, borderColor: '#eee', borderBottomWidth: 1}}>
                            <Text style={{color: '#69abd0', flex: 2}}>Email:</Text>
                            <Text style={{ flex: 3}}>{this.props.member.nok.email}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 15 }}>
                            <Text style={{color: '#69abd0', flex: 2}}>Nationality:</Text>
                            <Text style={{ flex: 3}}>{this.props.member.nok.nationality}</Text>
                        </View>
                        </View>
                ) : (null)}
            </View>
        </ScrollView>
    </MainMenu>
    );
  }

}

const mapStateToProps = state => ({
    user: state.auth.user,
    member: state.auth.member
  });

export default connect(mapStateToProps, { updateUser, updateMember })(Profile);
