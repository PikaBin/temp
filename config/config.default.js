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


  return {
    ...config,
    ...userConfig,
  };
};

