
import PouchDB from 'pouchdb-react-native';
import Config from '../config';

const localSysDB = new PouchDB(Config.db.localDB_SystemData);

export const EncodeForURL = (obj) => {
    const parts = [];
    Object.keys(obj).forEach(i => {
        if (obj[i]) {
            parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
        }
    });
    return parts.join('&');
};

export const IsUndefinedOrNull = (value) => 
(typeof value === 'undefined' || value === '' || value === ' ' || value === null);

export const getSystemDataById = Id => (new Promise((resolve, reject) => {
    if(Id){
        localSysDB.get(Id)
        .then(rec=>{
            resolve(rec)
        })
        .catch(err=>{
            reject('Not found')
        })
    } else {
        reject('Not found')
    }
}));

