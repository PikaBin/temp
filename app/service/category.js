
'use strict';
/**
 * 本文件封装了关于品类(category)的一些操作：
 * （1）增加（获取前端表单信息从而增加品类）
 * （2）删除
 * （3）更新
 * （4）查询
 *  (5) 上下架
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

    const Adjust = this.ctx.model.Adjust;
    const updatedData = await this.ctx.request.body;
    // console.log(updateInstance);
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
      // 品类上架的状况
      try {
        const categoryAdjust = await Adjust.create({
          object: 'c',
          objectId: this.ctx.query._id,
          action: '1', // 表明 是 增加申请
          verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: updatedData,
        });

        return {
          status: '1',
          information: '提交修改申请成功',
          categoryAdjust,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '1',
          information: '提交修改失败',
          error: err.message,
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
    const deleteInstance = await Category.findById(this.ctx.query._id);
    const Adjust = this.ctx.model.Adjust;
    const deleteData = await this.ctx.request.body;
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
        const CDInstance = await Adjust.create({
          object: 'c',
          objectId: this.ctx.query._id,
          action: '2', // 表明 是 删除申请
          verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: deleteData,
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
    const Adjust = this.ctx.model.Adjust;
    const data = await Category.findById(id);
    const changedData = await this.ctx.request.body; // 获取前端上下架时传下来的数据

    // 上/下架，新增记录，返回
    try {
      let upOroff = '3';
      if (data.categoryState === '0') {
        upOroff = '3';
      } else {
        upOroff = '4';
      }

      const upInstance = await Adjust.create({
        object: 'c',
        objectId: this.ctx.query._id,
        action: upOroff,
        verifyTime: null, // 审核时间
        timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
        changedData,
      });

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
