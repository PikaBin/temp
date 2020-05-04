
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
   * 修改品类
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

  /** 查询品类（列表）
   * @param {JSON} options 传入查询的条件
  */
  async queryCategory(options) {
    const Category = this.ctx.model.Category;
    const result = await Category.find(options).sort({ categoryAddTime: -1 });
    return result;
  }

  /** 删除品类 */
  async deleteCategory() {

    // 获取要删除的品类
    const Category = await this.ctx.model.Category;
    const deleteInstance = await this.ctx.request.body;
    const CategoryDelete = this.ctx.model.Deletecategory;
    // console.log(deleteInstance);

    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (deleteInstance.categoryState === '0') {
      try {
        const deleteResult = await Category.deleteOne({ _id: this.ctx.query._id });
        if (deleteResult.deletedCount !== 0) {
          return {
            information: '删除成功',
            status: '0',
            deleteResult,
          };
        }
        // 删除数量为空
        return {
          information: '删除失败',
          status: '1',
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

      try {
        // 新增 删除申请记录
        const CDInstance = await CategoryDelete.create({
          categoryID: this.ctx.query._id, // 品类ID
          applyTime: new Date(), // 申请时间
          verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
        });
        console.log('service层：' + CDInstance);
        return {
          state: '0',
          information: '提交删除成功，请等待审核',
          CDInstance,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '1',
          information: '提交删除失败',
          error: err.message,
        };
      }

    }
  }

  // 上下架品类,前端传来上/下 架的数据，query中传来_id
  async changeState() {
    // 获取前端的id和数据
    const id = await this.ctx.query._id;
    const Category = this.ctx.model.Category;
    const CategoryJudge = this.ctx.model.CategoryJudge;
    const data = await Category.findById(id);

    // 上/下架，新增记录，返回
    try {
      const upInstance = await CategoryJudge.create({
        timestamp: Date.now(), // 时间戳
        categoryID: id, // 品类id
        // auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
        // auditorID: { type: String, default: null }, // 审核人ID
        // auditTime: { type: String, required: false }, // 审核时间
        // applyTime: Date,
      });
      if (data.categoryState === '0') {
        upInstance.action = 'up';
      } else {
        upInstance.action = 'off';
      }
      return {
        information: '提交请求成功',
        status: '0',
        upInstance,
      };
    } catch (err) {
      return {
        information: '提交请求失败',
        status: '1',
        error: err.message,
      };
    }
  }
}

module.exports = CategoryService;
