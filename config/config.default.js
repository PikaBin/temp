/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
'use strict';
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578279037752_3622';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.upload = '/app/public/uploads';

  config.session = {
    key: 'SESSION_ID',
    maxAge: 1000 * 60 * 60 * 60, // 24h
    httpOnly: true,
    encrypt: true,
    renew: true, // 延长会话有效期
  };
  // 配置数据库
  exports.mongoose = {
    client: {
      url: 'mongodb://admin:admin123@59.110.162.236:27017/FW?authSource=admin',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },

    },
  };

  // 解决跨域
  exports.security = {
    domainWhiteList: [ 'http://localhost:8000', 'http://localhost:3000' ],
  };


  config.cors = {
  // origin: '*', //允许所有跨域访问，注释掉则允许上面 白名单 访问
    credentials: true, // 允许跨域请求携带cookies
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };


  return {
    ...config,
    ...userConfig,
  };
};

