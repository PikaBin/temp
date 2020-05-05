/**
 * 公共工具类,具体功能如下
 * 1.生成验证码
 * 2.md5加密
 */


'use strict';
const svgCaptcha = require('svg-captcha');
const md5 = require('md5');

const Service = require('egg').Service;
class ToolService extends Service {

  // 生产验证码
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 32,
      background: '#cc9966',
    });
    this.ctx.session.code = captcha.text;
    return captcha;
  }

  // md5加密
  async md5(str) {
    return md5(str);
  }

  // 类型转化工具，转为ObjectId
  async getObjectId(id) {
    const ObjectId = this.app.mongoose.Types.ObjectId;
    return new ObjectId(id);
  }

}

module.exports = ToolService;
