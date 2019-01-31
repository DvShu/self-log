const log4js = require('log4js');

// 需要忽略的请求日志
const ext = ['js', 'css', 'jpg', 'png', 'html', 'ico', 'map'];
const logger = log4js.getLogger('app');

class SelfLog {

  /**
   * 日志初始化的方法, 如果需要日志记录到文件, 则需要传入日志文件的名称
   * @param filename @{String} 日志文件名称, 可选;
   *    <br >如果不填, 则不写入日志到文件, 只有控制台日志;
   *    <br >如果填写了则会把 `info` 级别以上的所有日志记录到文件, 日志文件会每天回滚
   */
  constructor(filename) {
    let appenders = {
      console: { type: 'console' } // console.log 日志
    }, categoryAppenders = ['console'];
    if (filename != null) {
      Object.assign(appenders, {
        file: { type: 'dateFile', filename: `/tmp/${filename}.log`, keepFileExt: true },
        'just-file': {type: 'logLevelFilter', appender: 'file', level: 'info'}
      });
      categoryAppenders.push('just-file');
    }
    log4js.configure({
      appenders,
      categories: { default: { appenders: categoryAppenders, level: 'trace' } }
    });
  }

  /**
   * 记录请求和响应
   * @return {Function}
   */
  requestLogger () {
    return async (ctx, next) => {
      const start = Date.now(); // 接口请求开始时间
      await next();
      const ms = Date.now() - start;
      let url = ctx.url;
      let urlExt = url.substring(url.lastIndexOf('.') + 1); // 请求的文件后缀
      if(ext.includes(urlExt) === false) { // 需要忽略的请求后缀不包含该请求，正常打印日志
        logger.info(`${ctx.method} ${url} ${ctx.status} ${ms}ms`);
      } else { // 该请求包含在忽略列表
        if(ctx.status !== 200 && ctx.status !== 304) { // 请求失败，正常打印日志
          logger.warn(`${ctx.method} ${url} ${ctx.status} ${ms}ms`);
        }
      }
    }
  }

  /**
   * see: https://log4js-node.github.io/log4js-node/api.html - log4js.getLogger([category])
   * @param category log4js category
   * @return {Logger}
   */
  getLogger (category) {
    return log4js.getLogger(category);
  }
}

['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach((item) => {
  SelfLog.prototype[item] = (msg) => {
    logger[item](msg);
  }
});

module.exports = SelfLog;
