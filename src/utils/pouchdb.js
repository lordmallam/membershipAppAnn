import PouchDB from 'pouchdb-react-native';
import _ from 'lodash';

const views = [];
views.push({
  _id: '_design/doc_types',
  views: {
    by_type: {
      map: function (doc) {
          if (doc.doc_type && !doc.deleted) {
            emit(doc.doc_type);
          } 
        }.toString()
    },
    by_unSynced: {
        map: function (doc) { 
            if (!doc.isSynced) {
              emit(doc._id);
            } 
          }.toString()
      },
    by_userType: {
      map: function (doc) { 
          if (doc.type && !doc.deleted) {
            emit(doc.type);
          } 
        }.toString()
    }
  }
});

const checkComplete = (tracker, resolve, db) => {
  if (views.length === tracker) {
      console.log('views created successfully');
      resolve(db);
  }
};

const CreateViews = (db, enforce) => (new Promise((resolve, reject) => {
views.forEach((rec) => {
    let tracker = 0;
    db.put(rec)
    .then(() => {
        tracker++;        
        checkComplete(tracker, resolve, db); 
    })
    .catch((err) => {
  // some error (maybe a 409, because it already exists?)
      console.log(err);
  if (err.name === 'conflict' && enforce) {
    console.log('Enforcing view update', `${db.name} : ${err}`);
    db.allDocs()
    .then(res => (res.rows.filter(row => (row.id === err.docId))))
    .then(conflictDocSet => {
      const conflictDoc = _.first(conflictDocSet);
      if (conflictDoc) {
        rec._rev = conflictDoc.doc._rev;
        db.put(rec)
        .then(() => {
          tracker++;        
          checkComplete(tracker, resolve, db);
        })
        .catch();
      }
    })
    .catch(e => console.log('Cannot enforce view updates => ', e));
  } else {
    reject(err);
  }
});
});
}));

const ResetDB = (db) => new Promise((resolve, reject) => {
    const dbName = db.name;
    db.destroy()
    .then(() => {
        console.log(`${dbName} Database Deleted`);
        resolve(new PouchDB(dbName));
    })
    .catch(err => {
        reject(new PouchDB(dbName));        
 });
});

const GetById = (db, id) => (new Promise((resolve, reject) => {
  db.get(id)
  .then(res => resolve(res))
  .catch(err => reject(err));
}));

const PouchOps = {
    CreateViews,
    ResetDB,
    GetById
};

export default PouchOps;
