const logo = require('../src/images/logo.png');
const hostIP = 'ann.westeurope.cloudapp.azure.com';
const host = `http://${hostIP}`;
const dbHost = `http://annadmin:password@${hostIP}:5984/`;
const db_name = 'ann_db';

const Config = {
  environmentAuthority: {
    couchdbUrl: `${dbHost}`, // CouchDB instance where environment_db resides.
    remoteDB: `${db_name}`,
    apiUrl: `${host}/api/`,
    umsUrl: `${host}/ums/`
  },
  db: {
    localDB_SystemData: 'sysData',
    localDB_AppData: 'appData',
    remoteDB: `${dbHost}${db_name}`
  },
  resources: {
    logo,
    footerNote: 'ANN Membership v 1.0.1',
    appName: 'ANN Membership 2018',
    version: 'v 1.0'
  },
  docTypes: {
    user: 'user',
    member: 'member',
    state: 'state',
    lga: 'lga'
  }
};

export default Config;
