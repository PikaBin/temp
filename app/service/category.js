
'use strict';
/**
 * 本文件封装了关于品类(category)的一些操作：
 * （1）增加（获取前端表单信息从而增加品类）【未实现】
 * （2）删除
 * （3）更新
 * （4）查询
 */
const { Service } = require('egg');

class CategoryService extends Service {
// 增加品类
  // constructor(){
  //   super();

  // }

  async addCategory(req) {
    // const { app } = this;
    // console.log(this); undefined
    const Category = await this.ctx.model.Category;

    const categoryInstance = new Category(req);
    categoryInstance.save(err => {
      if (err) {
        // callback(err);
        console.log(err);
        return;
      }

    });
    return categoryInstance;
  }
}

module.exports = CategoryService;
