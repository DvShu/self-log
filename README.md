# self-log
## Language
English | [Chinese](https://github.com/DvShu/self-log/wiki 'Chinese').
## Description
The logs based on [log4js](https://log4js-node.github.io/log4js-node/index.html "log4js").
### Installation
```
// npm
npm install self-log

// yarn
yarn add self-log
```
### Use
#### 1. self-log
Use self-log logs.
```Javascipt
const SelfLog = require('self-log');
const selfLog = new SelfLog(filename);

# use self-log default category 'app'
selfLog.debug('debug')
selfLog.info('info')
selfLog.warn('warn')
selfLog.error('error')

# getLogger
const logger = SelfLog.getLogger('test');

logger.debug();
```
* filename: [String] - Optional; Log file path; If the filename parameter is passed, the `info`、`warn`、`error` logs will output to `console` and `filename.log`.
* getLogger: see [log4js-getLogger](https://log4js-node.github.io/log4js-node/api.html "log4js-getLogger") *getLogger*
#### 2. self-log + log4js
`log4js` configuration with `self-log` then use `log4js` *logger*.
##### Install log4js
```
yarn add log4js
```
##### Use
```Node
const log4js = require('log4js');
new (require('self-log'))(filename);
const logger = log4js.getLogger('test');

logger.debug();
```
3. Use in `koa`
```Node
var koa = require('koa');
var selfLog = new (require('self-log'))('app');

var app = koa();
app.use(selfLog.requestLogger()); //Logs requests and responses.

app.use(function (ctx, next) {
  selfLog.info('Got a request from %s for %s', ctx.request.ip, ctx.path);
  return next();
});

app.listen(8000);
```
> Note: `self-log` does not record static resource logs. Exclude `['js', 'css', 'jpg', 'png', 'html', 'ico', 'map']`.
