/* eslint-disable object-shorthand */
/**
 * 注册，以及登录方法
 */
'use strict';
const Controller = require('egg').Controller;

class LoginController extends Controller {

  // 注册
  async signUp() {
    console.log(this.ctx.request.body);
    const Operator = this.ctx.model.Operator;
    const account = await this.ctx.request.body.account;
    // console.log('password:' + typeof (this.ctx.request.body.password) + this.ctx.request.body.password);
    const password = await this.service.tools.md5(this.ctx.request.body.password);
    Operator.create({
      account: account,
      password: password,
    }, function(err, doc) {
      if (err) {
        console.log('signup错误：' + err);
        return;
      }
      return doc;
    });


  }
}
module.exports = LoginController;
