const R = require('ramda');

const fbToArray = objects => {
  return R.pipe(
    R.keys,
    R.map(firebaseKey => R.merge({ id: firebaseKey }, objects[firebaseKey]))
  )(objects);
};

module.exports = {
  fbToArray,
};
