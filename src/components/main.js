import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import PouchDB from 'pouchdb-react-native';
import _ from 'lodash';
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob'
import { blobOrBufferToBase64 } from 'pouchdb-binary-utils'
import { MainMenu, Button, Card, PageLoader } from './common';
import { Actions, ActionConst } from 'react-native-router-flux';
import Config from '../config';
import AuthActions from '../actions/auth';

const localAppDB = new PouchDB(Config.db.localDB_AppData);
const remoteAppDB = new PouchDB(Config.db.remoteDB);

const { updateUser, memberChanged, getCurrentUserAsync, getMemberAsync, systemDataChanged, isLoading } = AuthActions;

// global.Blob = RNFetchBlob.polyfill.Blob
// const Fetch = RNFetchBlob.polyfill.Fetch
// // replace built-in fetch
// global.fetch = new Fetch({
//   auto : true,
//   // now, response with Content-Type contains `image/`, `video/`, and `video/`
//   // will downloaded into file system directly.
//   binaryContentTypes : ['image/', 'video/', 'audio/'],
// }).build()
 
class Main extends Component {

  memberRepilcator = null;
  state = {
    isLoading: true
  }

  componentDidMount() {
    this.props.isLoading(true)
    this.props.getCurrentUserAsync()
    .then(user => {
      if(user && user.member){
        this.replication(user.member);
        this.props.getMemberAsync()
        .then(() => {          
          this.props.isLoading(false)
        })
        .catch(err=> {
          console.log(err)
        });
        this.props.systemDataChanged();
      } else {
        this.props.isLoading(false)
        Actions.auth({type: ActionConst.RESET});
      }
    })
    .catch(err => {
      console.log(err);
      Actions.auth({type: ActionConst.RESET});
    });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.member !== null && this.props.isLoad) {
      this.props.isLoading(false)
    }
  }

  replication = member => {
    if(this.memberRepilcator){
      this.memberRepilcator.cancel();
      this.DBRepilcator.cancel();
    }
    this.memberRepilcator = PouchDB.replicate(remoteAppDB, localAppDB,
      {
        filter: 'mobile/by-member',
        query_params: { memberID: member },
        live: true,
        retry: true,
        attachments: true
      })
      .on('change', info => {
        this.props.memberChanged(_.first(info.docs));
      })
      .on('paused', info => {
        console.log('paused', info);
      })
      .on('active', info => {
        console.log('active', info);
      })
      .on('error', info => {
          console.log('Member Replication Error', info);
          ToastAndroid.showWithGravity('Error replicating user profile', 
          ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      });
      this.DBRepilcator = PouchDB.replicate(localAppDB, remoteAppDB,
        {
            live: true,
            retry: true
        })
        .on('change', info => {
          console.log('changed', info);
        })
        .on('paused', info => {
          console.log('paused', info);
        })
        .on('active', info => {
          console.log('active', info);
        })
        .on('error', info => {
            console.log('Replication Error to Remote', info);
            ToastAndroid.showWithGravity('Error replicating your profile data', 
            ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        });
  };

  onProfile = () => {
    Actions.profile();
  }

  render() {
    return (
      <MainMenu 
            id={'mainMenu'}
            ref={'menu'}
            info={{ user: this.props.user }}
      >
      <PageLoader visible={this.props.isLoad} />
        <ScrollView style={{ flex: 1 }}>
          {
            this.props.member ? 
                (<View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3a6a75', alignSelf: 'center', marginTop: 30}}>
                    Welcome {this.props.member.firstname}!</Text>
                    <View style={{ marginTop: 30, marginBottom: 20, marginLeft: 20, marginRight: 20, backgroundColor: '#fff',
                    borderRadius: 10, elevation: 4, padding: 10}}>
                      <Text style={{ fontFamily: 'fa-solid', fontSize: 50, color: '#73b650', alignSelf: 'center', marginBottom: 10 }}>
                      &#xf0a3;</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 10, color: '#3a6a75', marginBottom: 10, alignSelf: 'center'}}>
                      MEMBER SINCE</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#3a6a75', marginBottom: 10, alignSelf: 'center'}}>
                      {moment(this.props.member.createdOn).format('DD MMMM, YYYY')}</Text>
                      <Text style={{ alignSelf: 'center' }}>{this.props.member.status === 'completed' || this.props.member.status === 'active' ? 'ACTIVE' : 'INACTIVE'}</Text>
                      <View style={{ marginRight: 30, marginLeft: 30}}>
                      <Button
                        Text='Go to Profile'
                        onPress={this.onProfile}
                        style={{
                          backgroundColor: '#73b650',
                          marginLeft: 0,
                          marginRight: 0,
                          flex: 0
                        }}
                      />
                      </View>
                    </View>
                  </View>
              ) :(<View/>)
            }
          <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 3, marginTop: 3, marginLeft: 10, marginRight: 10 }}>
            <View style={{ flex: 1}}>
              <Card text='My Reps' icon='&#xf0c0;' color='#50b6a6'/>
            </View>
            <View style={{ flex: 1}}>
              <Card text='Membership' icon='&#xf007;' color='#5079b6'/>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 3, marginTop: 3, marginLeft: 10, marginRight: 10 }}>
            <View style={{ flex: 1}}>
              <Card text='Notifications' icon='&#xf0f3;' color='#abb650'/>
            </View>
            <View style={{ flex: 1}}>
              <Card text='News' icon='&#xf1ea;' color='#504ea3'/>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 3, marginTop: 3, marginLeft: 10, marginRight: 10 }}>
            <View style={{ flex: 1}}>
              <Card text='Complaints' icon='&#xf071;' color='#b65c50'/>
            </View>
            <View style={{ flex: 1}}>
              <Card text='FAQs' icon='&#xf059;' color='#73b650'/>
            </View>
          </View>
          </View>
        </ScrollView>
      </MainMenu>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  member: state.auth.member,
  isLoad: state.auth.isMainLoading
});

export default connect(mapStateToProps, { updateUser, memberChanged, getCurrentUserAsync, getMemberAsync, systemDataChanged, isLoading })(Main);
