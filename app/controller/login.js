/* eslint-disable object-shorthand */
/**
 * 注册，以及登录方法
 */
'use strict';
const Controller = require('egg').Controller;

class LoginController extends Controller {

  // 注册
  async signUp() {
    // console.log(this.ctx.request.body);
    const Operator = this.ctx.model.Operator;
    // console.log('password:' + typeof (this.ctx.request.body.password) + this.ctx.request.body.password);
    try {
      const account = await this.ctx.request.body.account;
      const password = await this.service.tools.md5(this.ctx.request.body.password);
      const operatorInstance = await Operator.create({
        account: account,
        password: password,
      });
      // 注册成功，返回前端数据
      this.ctx.body = operatorInstance + '注册成功';
      this.ctx.status = 200;
    } catch (err) { //  注册失败，捕获原因
      console.log('err信息' + err);
      return;
    }


  }

  // 登录 验证码，查询账户，密码
  async signIn() {
    console.log(this.ctx.request.body);
    const { account, code } = await this.ctx.request.body;
    // const code = await this.ctx.request.body.code;
    console.log('this.ctx.session.code' + this.ctx.session.code);
    // const account = await this.ctx.request.body.account;
    this.ctx.session.code = 1234;
    const password = await this.service.tools.md5(this.ctx.request.body.password);
    // 判断验证码
    if (code.toUpperCase() === '1234') {
      const result = await this.ctx.model.Operator.find({ account, password });
      if (result.length > 0) {
        this.ctx.session.userinfo = result[0];
        this.ctx.body = result;
        console.log('查询结果信息：' + result);
      } else {
        this.ctx.body = '账号或者密码不正确';
        return;
      }
    } else {
      this.ctx.body = '验证码不正确';
      return;
    }
  }
}
module.exports = LoginController;
