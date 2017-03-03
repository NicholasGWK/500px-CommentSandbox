const state = require('./state.js');
const consumerKey = require('./500pxAPIKey.js');
const R = require('ramda');
const fetch = require('node-fetch');

const apiUrl = 'https://api.500px.com/v1';

const validateAPIKey = (ctx, next) => {
  const apiKey = ctx.query.apiKey;
  if (!apiKey) {
    ctx.throw('Error: Please provide an API key', 400);
  }
  const apiKeys = state.get('apiKeys');
  const key = R.prop('key', R.defaultTo({}, R.find(keyObj => keyObj.key === apiKey, apiKeys)));
  if (!key) {
    ctx.throw({ message: 'Error: Invalid API key.', code: 400 }, 400);
  }
  ctx.state.key = key;
  return next();
};

const paramRequired = ([paramType, paramName]) => (ctx, next) => {
  let exists;
  if (paramType !== 'body') {
    exists = R.path([paramType, paramName], ctx);
  } else {
    exists = R.path(['request', 'body', paramName], ctx);
  }
  if (!exists) {
    ctx.throw({ message: `Expected param '${paramName}' in ${paramType} params`, code: 400 }, 400);
  }
  return next();
};

const proxyTo500px = ctx => {
  const { request: { body }, query, url, method } = ctx;
  const consumerQueryParam = `consumer_key=${consumerKey}`;
  const consumerPrefix = R.isEmpty(query) ? '?' : '&';
  const fetchURL = `${apiUrl}${url}${consumerPrefix}${consumerQueryParam}`;
  return fetch(fetchURL, { body, method }).then(response => {
    if (response.ok) {
      return response.json();
    }
    return ctx.throw(response.statusText, response.status);
  }).then(data => {
    ctx.body = data;
  }).catch(err => {
    console.log(err);
    ctx.status = err.status;
    ctx.body = err;
  });
};

const stripPrefix = (ctx, next) => {
  const regex = /\/api(.*)/;
  ctx.url = ctx.url.match(regex)[1];
  return next();
};

const errorResponder = (ctx, next) => {
  next().catch(e => {
    ctx.status = e.status;
    ctx.body = { message: e.message };
  });
};


module.exports = {
  validateAPIKey,
  paramRequired,
  proxyTo500px,
  stripPrefix,
  errorResponder,
};
