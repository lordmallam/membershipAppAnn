import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Main from './components/main';
import Login from './components/login';
import Profile from './components/profile'
import TakePic from './components/profile/takePic'
import EditProfile from './components/profile/edit_profile'
import EditNok from './components/profile/edit_nok'
import Register from './components/register'
import Nok from './components/register/nok'

const RouterComponent = () => (
  <Router key='parent' sceneStyle={{ backgroundColor: '#f1f1f1' }}>
    <Scene key='rootScene'>
      <Scene key='register'>
        <Scene key='personal' component={Register} hideNavBar />
        <Scene key='nok' component={Nok} hideNavBar/>
      </Scene>
      <Scene key='auth'>
        <Scene key='login' component={Login} hideNavBar />
      </Scene>
      <Scene key='main' initial>
        <Scene key='home' component={Main} hideNavBar />
        <Scene key='profile' component={Profile} hideNavBar/>
        <Scene key='takepic' component={TakePic} hideNavBar/>
        <Scene key='editProfile' component={EditProfile} hideNavBar/>
        <Scene key='editNok' component={EditNok} hideNavBar/>
      </Scene>
    </Scene>
  </Router>
);

export default RouterComponent;