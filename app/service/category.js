
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
   * 判断要修改的品类是否为上架状态，如果是，则提交申请，返回前端提示信息；
   * 如果未上架，直接修改，然后返回修改后的品类数据；
   * 获取前端更新值，存储到品类申请表，等待平台审核
   * state为0为修改失败，为1则成功
   */
  async updateCategory_O(data) {
    // 查询要更新的品类
    const Category = await this.ctx.model.Category;
    const updateInstance = await Category.findById(this.ctx.query._id);
    console.log(updateInstance);
    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (updateInstance.categoryState === '0') {
      try {
        const updateResult = await Category.updateOne({ _id: this.ctx.query._id }, data);
        const latestOne = await Category.findById({ _id: this.ctx.query._id });
        console.log('查询结果：' + JSON.stringify(updateResult));
        if (updateResult.nModified === 0) {
          return {
            information: '更新失败',
            status: '0',
            error: '无匹配',
          };
        }
        return {
          information: '更新成功',
          status: '1',
          latestOne,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          information: '更新失败',
          status: '1',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {
      const CategoryAsk = await this.ctx.model.CategoryAsk;
      const CAInstance = new CategoryAsk(data);
      CAInstance.timestamp = Date.now(); // 因为model表中默认时间戳的值不会更新，所以在这里改变
      // console.log('service层：' + CAInstance);
      try {
        CAInstance.save();
        return {
          state: '0', // 修改成功
          information: '提交修改成功，请等待审核',
          CAInstance,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '1',
          information: '提交修改失败',
          CAInstance,
        };
      }

    }
  }

  // 品类列表展示
  async queryCategory(options) {
    const Category = this.ctx.model.Category;
    const result = await Category.find(options).sort({ categoryAddTime: -1 });
    return result;
  }

  // 删除品类
  async deleteCategory() {

    // 获取要删除的品类
    const Category = await this.ctx.model.Category;
    const deleteInstance = await this.ctx.request.body;
    console.log(deleteInstance);

    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (deleteInstance.categoryState === '0') {
      try {
        const deleteResult = await Category.deleteOne({ _id: this.ctx.query._id });
        // const latestOne = await Category.findById({ _id: this.ctx.query._id });
        // console.log('查询结果：' + JSON.stringify(updateResult));
        // if (updateResult.nModified === 0) {
        //   return {
        //     information: '更新失败',
        //     status: '0',
        //     error: '无匹配',
        //   };
        // }
        return {
          information: '删除成功',
          status: '1',
          deleteResult,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          information: '删除失败',
          status: '1',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {
      const CategoryAsk = await this.ctx.model.CategoryAsk;
      const CAInstance = new CategoryAsk();
      CAInstance.timestamp = Date.now(); // 因为model表中默认时间戳的值不会更新，所以在这里改变
      // console.log('service层：' + CAInstance);
      try {
        CAInstance.save();
        return {
          state: '0', // 修改成功
          information: '提交修改成功，请等待审核',
          CAInstance,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '1',
          information: '提交修改失败',
          CAInstance,
        };
      }

    }
  }
}

module.exports = CategoryService;
