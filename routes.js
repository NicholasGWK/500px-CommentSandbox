const Router = require('koa-router');
const crypto = require('crypto');
const transporter = require('./transporter');
const firebase = require('./firebase.js');
const state = require('./state.js');
const R = require('ramda');
const { errorResponder } = require('./middleware');

const {
  validateAPIKey,
  paramRequired,
  proxyTo500px,
  stripPrefix,
} = require('./middleware.js');

const router = new Router();
router.use(errorResponder);

const sendApiKey = (email, hash) => {
  const mailOptions = {
    from: '"API KEY" <jsgbcapikeys@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Your API Key ', // Subject line
    text: hash, // plain text body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new Error(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};


router.post('/api/key', ctx => {
  const randomBytes = crypto.randomBytes(1024).toString('base64');
  const hash = crypto.createHash('sha256');
  hash.update(randomBytes);
  const hashPlaintext = hash.digest('hex');
  try {
    sendApiKey(ctx.query.email, hashPlaintext);
    firebase.setOrUpdateAPIKey(hashPlaintext, ctx.query.username, ctx.query.email);
    ctx.body = 'Your api key has been emailed.';
    ctx.status = 200;
  } catch (e) {
    console.log(e);
    ctx.status = 400;
    e.body = e;
  }
});

router.get('/api/photos/:photoId/comments',
  validateAPIKey,
  paramRequired(['params', 'photoId']),
  ctx => {
    ctx.body = R.filter(comment => comment.photoId === ctx.params.photoId, state.get('comments'));
  });

router.post('/api/photos/:photoId/comments',
  validateAPIKey,
  paramRequired(['params', 'photoId']),
  paramRequired(['body', 'text']),
  ctx => {
    const photoId = ctx.params.photoId;
    const { text } = ctx.request.body;
    const { key } = ctx.state;
    ctx.body = { key: firebase.addComment({ photoId, userId: key, text }) };
  });

router.get('/api/photos', stripPrefix, proxyTo500px);
router.get('/api/photos/:photoId', stripPrefix, proxyTo500px);

module.exports = router;
