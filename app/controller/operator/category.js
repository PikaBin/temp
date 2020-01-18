'use strict';

/**
 * 暂时用来测试category
 */

const { Controller } = require('egg');

class categoryController extends Controller {

  // 增加品类,
  /**
   * 首先是从前端获取请求附带的数据（应该加上验证）
   * 其次调用相应的service方法处理
   * 将处理结果返回给用户
   */

  async addCategory() {
    const { ctx, service } = this;
    const req = await ctx.request.body;// 获取数据
    // console.log('req ' + req.categoryRule);
    // console.log('req的类型：' + typeof (req));
    // 调用相应的service方法进行处理
    const categoryInfo = await service.category.addCategory(req);
    ctx.status = 201;
    ctx.res.body = categoryInfo;
    console.log(categoryInfo);
    // categoryService(req, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log('data：' + data);
    //   // 将处理结果返回给用户
    //   ctx.status = 201;
    //   ctx.res.body = '创建品类成功：' + data;
    // });
  }


  // async addCategory() {
  //   const Category = await this.ctx.model.Category;
  //   console.log('what is Category:' + Category);

  //   const req = await this.ctx.request.body.newcategory;

  //   const categoryInstance = new Category({
  //     categoryName: req.categoryName,
  //     categoryIntrod: req.categoryIntrod,
  //     categoryRule: req.categoryRule,
  //   });

  //   categoryInstance.save(err => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     console.log('新建品类：' + categoryInstance);

  //   });
  //   this.ctx.status = 201;
  //   this.ctx.body = categoryInstance;
  // }

}
module.exports = categoryController;
