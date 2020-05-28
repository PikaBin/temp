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
  config.middleware = [ 'csrfAuth' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.upload = 'app/public/uploads/operator/';


  config.session = {
    key: 'operator', // key是存储在cookie中所有session值的合称；
    maxAge: 1000 * 3600 * 24, // 24h
    httpOnly: true,
    encrypt: true,
    renew: true, // 延长会话有效期
  };

  // 配置数据库
  exports.mongoose = {
    client: {
      url: 'mongodb://admin:admin123@59.110.162.236:27017/lastone?authSource=admin',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },

    },
  };

  // 解决跨域
  exports.security = {
    domainWhiteList: [ 'http://localhost:8000', 'http://localhost:3000', 'http://localhost:7002', 'http://localhost:7003',
      'http://localhost:8001', 'http://localhost:3001', 'http://47.103.1.149:5000', 'http://47.103.1.149:5001', 'http://111.231.135.169:5000', 'http://111.231.135.169:5001' ],
    csrf: {
      // ignore: '/manager',
      enable: false,
      ignoreJSON: true,
    },
  };


  config.cors = {
    // origin: '*', // 允许所有跨域访问，注释掉则允许上面 白名单 访问
    credentials: true, // 允许跨域请求携带cookies
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // 配置表单多字段提交
  exports.multipart = {
    fields: '10000',
  };

  // 配置服务启动的端口
  config.cluster = {
    listen: {
      path: '',
      port: 7002,
      hostname: '0.0.0.0',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};

