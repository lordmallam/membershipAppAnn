import React, { Component } from 'react';
import { Image, View, Text, Keyboard, Picker, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PouchDB from 'pouchdb-react-native';
import { Actions } from 'react-native-router-flux'
import _ from 'lodash';
import { Button, TextBox, Spinner } from './common';
import Config from '../../src/config';
import AuthActions from '../actions/auth';
import PouchDBOps from '../utils/pouchdb';

const { emailChanged, passwordChanged, loginUser, setLoginUser, getCurrentUserAsync, loginFailed, systemDataChanged } = AuthActions;
const { ResetDB } = PouchDBOps;

const localSysDB = new PouchDB(Config.db.localDB_SystemData, { adapter: 'asyncstorage' });
const localAppDB = new PouchDB(Config.db.localDB_AppData, { adapter: 'asyncstorage' });
const remoteAppDB = new PouchDB(Config.db.remoteDB);

class Login extends Component {

  state = {
    username: '',
    password: '',
    error: '',
    isLoading: false,
    animh: 150
  };

  sysRepilcator = null;

  componentDidMount() {
    ResetDB(localAppDB).catch(err=>console.log(err));
    ResetDB(localSysDB).then(db => {localSysDB = db; this.replication();}).catch(err=>console.log(err));
  }

  onUsernameChanged(text) {
    this.props.emailChanged(text);
  }
  onPasswordChanged(text) {
    this.props.passwordChanged(text);
  }

  onLogin() {
    const credentials = { username: this.props.email, password: this.props.password };
    Keyboard.dismiss();
    this.onPasswordChanged('');
    if (credentials.password && credentials.username) {
      this.props.loginUser(credentials);
    } else {
      this.props.loginFailed('Enter your email and password');
    }
  }

  onSignUp = () => {
    Actions.register();
  };

  replication = () => {
    if(this.sysRepilcator){
      this.sysRepilcator.cancel();
    }
    this.sysRepilcator = PouchDB.replicate(remoteAppDB, localSysDB,
      {
        filter: 'mobile/by-systemData',
        live: true,
        retry: true
      })
      .on('change', info => {
        this.props.systemDataChanged();
      })
      .on('error', info => {
          console.log('System Data Replication Error', info);
          ToastAndroid.showWithGravity('Error replicating system data', 
          ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      });
  };
  
  renderButton() {
    return this.props.isLoading ? <View><Spinner style={{ flex: 0 }} /></View> :
      <Button
        Text='Login'
        onPress={this.onLogin.bind(this)}
        style={{
          backgroundColor: '#73b650',
          marginLeft: 0,
          marginRight: 0,
          flex: 0
        }}
      />;
  }

  renderError() {
    return this.props.hasError ?
      <Text style={this.styles.errorText}>{this.props.error}</Text> :
      <Text style={this.styles.errorTextNone}>{''}</Text>;
  }

  styles = {
    logoStyle: {
      width: 100,
      height: 100,
      marginBottom: 50
    },
    inputContainer: {
      flexDirection: 'column',
      alignSelf: 'stretch',
      flex: 1
    },
    inputUsername: {
      backgroundColor: '#FFF',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5
    },
    inputPassword: {
      backgroundColor: '#FFF',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5
    },
    errorText: {
      color: '#fce4af',
      padding: 10,
      margin: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 10,
      textAlign: 'center'
    },
    errorTextNone: {
      color: '#fff',
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderRadius: 5
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1}}>
      <View style={{ backgroundColor: '#f1f1f1' }}>
        <View style={{ maxWidth: 480, minWidth: 400, paddingLeft: 30, paddingRight: 30, alignSelf: 'center', flex: 0 }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={this.styles.logoStyle} resizeMode='contain'
              source={Config.resources.logo}
            />
          </View>
          <View style={{ flexDirection: 'row' }} >
            <View style={this.styles.inputContainer}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#f2f2f2' }}>
                <TextBox
                  placeholder='Enter email...'
                  style={this.styles.inputUsername}
                  keyboardType='email-address'
                  onChangeText={this.onUsernameChanged.bind(this)}
                  value={this.props.email}
                />
              </View>
              <TextBox
                placeholder='Password'
                style={this.styles.inputPassword}
                isSecure
                onChangeText={this.onPasswordChanged.bind(this)}
                value={this.props.password}
              />
            </View>
          </View>
          <View style={{ padding: 20 }}>
          <TouchableOpacity style={{ flex: 0, alignSelf: 'flex-end' }}>
            <Text style={{ flex: 0, color: '#73b650' }}>Forgot Password?</Text>
          </TouchableOpacity>
          </View>
          <View style={{ height: 150 }} >
            {this.renderButton()}
            {this.renderError()}
          </View>
          <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'center'}}>
          <Text>Want to be a member? </Text>
          <TouchableOpacity style={{ flex: 0 }} onPress={this.onSignUp}>
            <Text style={{ flex: 0, color: '#73b650', fontWeight: 'bold' }}>Sign Up, it's Free</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  email: state.auth.email,
  password: state.auth.password,
  error: state.auth.error,
  hasError: state.auth.error !== '',
  isLoading: state.auth.isLoading,
  currentUser: state.auth.user
});

export default connect(mapStateToProps, {
  emailChanged,
  passwordChanged,
  loginUser,
  setLoginUser,
  getCurrentUserAsync,
  loginFailed,
  systemDataChanged
})(Login);

