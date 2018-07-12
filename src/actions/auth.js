import PouchDB from 'pouchdb-react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import Types from './types';
import Config from '../config';
import PouchOps from '../utils/pouchdb';
import { EncodeForURL } from '../utils';

const localSysDB = new PouchDB(Config.db.localDB_SystemData);
const localAppDB = new PouchDB(Config.db.localDB_AppData, {adapter: 'asyncstorage'});

let request = new XMLHttpRequest();

// Login --- Authentication Actions

const emailChanged = (text) => ({
  type: Types.EMAIL_CHANGED,
  payload: text
});

const isLoading = result => ({
  type: Types.IS_LOADING,
  payload: result
});

const setLoginUser = (user) => ({
  type: Types.LOGIN_SUCCESS,
  payload: user
});

const passwordChanged = (text) => ({
  type: Types.PASSWORD_CHANGED,
  payload: text
});

const statesChanged = states => ({
  type: Types.STATES_CHANGED,
  payload: states
});

const lgasChanged = lgas => ({
  type: Types.LGAS_CHANGED,
  payload: lgas
});

const terminateLogin = (text) => ({
  type: Types.LOGIN_TERMINATED,
  payload: {}
});

const updateUser = user => ({
  type: Types.UPDATE_USER,
  payload: user
});

memberChanged = member => ({
  type: Types.MEMBER_CHANGED,
  payload: member
});

const updateMember = member => dispatch => (new Promise((resolve, reject) => {
  if(member._id){
    member = _.omit(member, '_rev')
    member.modifiedOn = new Date()
    localAppDB.get(member._id, {attachments: true})
    .then(rec => {
      const uMember = Object.assign(rec, member);
      localAppDB.put(uMember)
      .then(m =>{
        localAppDB.get(m.id, {attachments: true})
        .then(v=> {
          dispatch(memberChanged(v))
        })
        .catch(err=>console.log(err))        
        resolve(true)
      })
      .catch(err=>{console.log(err); reject(false)})
    })
    .catch(err=>{console.log(err); reject(false)})
  }else{
    reject(false);
  }
}));

const loginUser = (credentials) => (dispatch) => {
  if (credentials.username === '' || credentials.password === '') {
    dispatch(loginFailed('Enter email and password'));
  } else {
    dispatch({ type: Types.LOGIN_STARTED });
    const URL = `${Config.environmentAuthority.umsUrl}auth`
    if(request.readyState === 4){ 
      request.abort()
    }
      request.open('POST', URL);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.onreadystatechange = () => onLogin(dispatch);
      request.send(EncodeForURL(credentials));
  }
};

const onGetMe = (dispatch) => {
  if(request.readyState == 4 && request.status == 200) {
    const userData = JSON.parse(request.responseText)
    getConfigAndSaveUserLocally(userData, dispatch);
  } else if(request.status !== 200) {
    dispatch(loginFailed(`Could not retrive member's details`));
  }
};

const onLogin = (dispatch) => {
  if(request.readyState == 4 && request.status == 200) {
    const data = JSON.parse(request.responseText)
    if (data.token) {
      request = new XMLHttpRequest()
      const URL = `${Config.environmentAuthority.umsUrl}users/me`;
      request.open('GET', URL);
      request.setRequestHeader("Content-type", "application/json");
      request.setRequestHeader("Authorization", `Bearer ${data.token}`);
      request.onreadystatechange = () => onGetMe(dispatch)
      request.send()
    } else {
      dispatch(loginFailed('Wrong username or password'));
    }
  } else if(request.status !== 200) {
    dispatch(loginFailed('Wrong username or password'));
  }
};

const getConfigAndSaveUserLocally = (user, dispatch) => {
  const nUser = _.omit(user, '_rev');
  nUser.type = 'user';
  storeSysDataLocally(localSysDB, nUser, dispatch);
};

const storeSysDataLocally = (db, user, dispatch) => {
  db.post(user)
    .then(() => {
      if(user.member){
        dispatch(setLoginUser(user));
        Actions.reset('main');
      } else {
        dispatch({ type: Types.LOGIN_FAILED, payload: 'Account not linked to a profile. Contact accounts@alliancefornewnigeria.org' });
      }      
    })
    .catch(err => { 
      console.log(err);
      dispatch({ type: Types.LOGIN_FAILED, payload: err });
    });
};

const loginFailed = (err) => ({
  type: Types.LOGIN_FAILED,
  payload: err
});

const getCurrentUser = () => (dispatch) => {
  localSysDB.query('doc_types/by_userType', {
    key: Config.docTypes.user,
    include_docs: true
  })
    .then(userDoc => {
      if (userDoc.rows.length) {
        dispatch(setLoginUser(_.first(userDoc.rows).doc));
      }
    })
    .catch(err => console.log(`No user account on file : ${err}`));
};

const getCurrentUserAsync = () => (dispatch) => (new Promise((resolve, reject) => {
  localSysDB.allDocs()
    .then(userDoc => {
      const data = _.first(userDoc.rows.filter(row => (row.doc.type === Config.docTypes.user)));
      dispatch(setLoginUser(data ? data.doc : null));
      resolve(data ? data.doc : data);
    })
    .catch(err => reject(`No user account on file : ${err}`));
}));


const getMemberAsync = () => (dispatch) => (new Promise((resolve, reject) => {
  localAppDB.allDocs({
    include_docs: true,
    attachments: true
  })
    .then(userDoc => {
      const data = _.first(userDoc.rows.filter(row => (row.doc.doc_type === Config.docTypes.member)));
      if(data && data.doc){
        dispatch(memberChanged(data.doc));
        resolve(data.doc);
      } else {
        reject('Member details not found')
      }
      
    })
    .catch(err => reject(`No member profile on file : ${err}`));
}));

const systemDataChanged = () => dispatch => {
  localSysDB.allDocs()
  .then(rec => {
    const states = rec.rows.filter(row => (row.doc.doc_type === Config.docTypes.state)).map(row => (row.doc));
    const lgas = rec.rows.filter(row => (row.doc.doc_type === Config.docTypes.lga)).map(row => (row.doc));
    dispatch(statesChanged(states));
    dispatch(lgasChanged(lgas));
  })
  .catch(err => console.log(err));
};

const AuthActions = {
  loginUser,
  passwordChanged,
  emailChanged,
  loginFailed,
  setLoginUser,
  getCurrentUser,
  getCurrentUserAsync,
  updateUser,
  memberChanged,
  getMemberAsync,
  systemDataChanged,
  updateMember,
  isLoading
};

export default AuthActions;
