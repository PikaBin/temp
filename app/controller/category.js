/**
 * 品类
 */
'use strict';

const { Controller } = require('egg');
class categoryController extends Controller {

  // 新增品类
  async addCategry() {
    // const { ctx, service } = this;
    const data = this.ctx.request.body;
    try {
      if (this.ctx.session.userinfo) {
        const categoryInstance = await this.service.category.addCategory(data);
        this.ctx.status = 201;
        this.ctx.body = categoryInstance;
      } else {
        this.ctx.body = '未登录';
      }

    } catch (err) {
      console.log(err);
      this.ctx.body = '出现了未知错误';
    }


  }
}

module.exports = categoryController;
