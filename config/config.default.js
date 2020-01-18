/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
// module.exports = appInfo => {
//   /**
//    * built-in config
//    * @type {Egg.EggAppConfig}
//    **/
//   const config = exports = {};

//   // use for cookie sign key, should change to your own and keep security
//   config.keys = appInfo.name + '_1578279037752_3622';

//   // add your middleware config here
//   config.middleware = [];

//   // add your user config here
//   const userConfig = {
//     // myAppName: 'egg',
//   };

//   return {
//     ...config,
//     ...userConfig,
//   };
// };
'use strict';
exports.keys = '1578279037752_3622';

exports.mongoose = {
  client: {
    url: 'mongodb://admin:admin123@123.57.254.158:27017/test?authSource=admin',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },

  },
};
