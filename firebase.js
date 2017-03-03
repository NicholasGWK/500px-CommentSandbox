const admin = require('firebase-admin');
const serviceAccount = require('./firebaseInit.json');
const R = require('ramda');
const state = require('./state.js');

const helpers = require('./helpers.js');

const firebaseUrl = 'https://jsgbc-c5f0d.firebaseio.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseUrl,
});

const db = admin.database();

const apiKeyRef = db.ref('/apiKeys');
const commentsRef = db.ref('/comments');

commentsRef.on('value', data => {
  state.set('comments', helpers.fbToArray(data.val()));
});

apiKeyRef.on('value', data => {
  state.set('apiKeys', helpers.fbToArray(data.val()));
});

const storeNewApiKey = (key, username, email) => {
  apiKeyRef.push().set({
    key,
    username,
    email,
  });
};

const updateExistingApiKey = (firebaseKey, newKey) => {
  const existingKeyRef = apiKeyRef.child(firebaseKey);
  existingKeyRef.update({ key: newKey });
};


const setOrUpdateAPIKey = (key, username, email) => {
  const emailExists = R.filter(value => value.email === email, state.get('apiKeys'))[0];
  if (emailExists) {
    updateExistingApiKey(emailExists.id, key);
  } else {
    storeNewApiKey(key, username, email);
  }
};

const addComment = ({ photoId, userId, text }) => {
  const pushRef = commentsRef.push();
  pushRef.set({
    photoId,
    userId,
    text,
  });

  return pushRef.key;
};

module.exports = {
  setOrUpdateAPIKey,
  addComment,
};
