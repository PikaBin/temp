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


  // 修改品类
  async updateCategory_O() {
    const req = await this.ctx.request.body;
    const CAinstance = await this.ctx.service.category.updateCategory_O(req);
    this.ctx.body = CAinstance;
    // console.log(JSON.stringify(CAinstance));
  }

  // 查询品类
  async queryCategory() {
    const req = await this.ctx.query;
    try {
      const result = await this.ctx.service.category.queryCategory(req);
      this.ctx.body = {
        status: '0',
        information: '查询成功',
        res: result,
      };
    } catch (err) {
      console.log('err信息：' + err);
      this.ctx.body = {
        status: '0',
        information: '查询失败',
      };
    }
  }

  // 删除品类
  async deleteCategory() {
    const deleltecategory = await this.ctx.service.category.deleteCategory();
    this.ctx.body = deleltecategory;
    console.log('总controller' + JSON.stringify(deleltecategory));
  }

  // 品类上架或者下架
  async upOroff() {
    const result = await this.ctx.service.category.changeState();
    this.ctx.body = result;
    console.log('contorller:' + JSON.stringify(result));
  }
}

module.exports = categoryController;
