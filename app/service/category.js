
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

  /**
   * 新增品类
   */
  async addCategory() {

    const Category = await this.ctx.model.Category;
    // console.log(this.ctx.body.category);
    const categoryInstance = new Category(this.ctx.request.body);
    categoryInstance.save(err => {
      if (err) {
        // callback(err);
        console.log(err);
      }

    });
    return categoryInstance;
  }

  /**
   * 更新品类
   * @param {object}data 要修改的数据
   */
//   async updateCategory(data) {
//     const Category = await this.ctx.model.Category;

//     const cate
//   }
// }

module.exports = CategoryService;
