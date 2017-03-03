const Koa = require('koa');
const cors = require('kcors');
const serve = require('koa-static');
const mount = require('koa-mount');
const router = require('./routes');
const bodyParser = require('koa-body');

const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(mount(serve('.')), '/');

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(8081);
console.log('Running on port 8081');
