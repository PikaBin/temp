
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
   * 发消息
   * @param {ObjectId} operatorId 运营商id
   * @param {ObjectId} objectId 申请审核的对象id
   * @param {ObjectId} adjust 申请记录
   */
  async sendNews(operatorId, objectId, adjust) {
    const Operator = this.ctx.model.Operator;
    const News = this.ctx.model.Verify.News;
    const operator = await Operator.findById(operatorId);
    const staffId = await this.ctx.service.tools.getObjectId('5ecf718fea085632dc5e02d2'); // 注意这是写死的
    const news = await News.create({
      receiveId: staffId, // 消息接受对象的id
      senderId: operatorId,
      auditorName: operator.operatorName, // 发送消息者姓名
      object: 'o', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
      action: 't', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
      detailObject: 'c', // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
      detailObjectId: objectId, // 具体处理对象id
      result: '0', // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
      timestamp: Date.now(),
      verifiedData: adjust, // 存放相关中间表数据
    });

    if (news) {
      return news;
    }
    return null;
  }

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
   * 前端传入品类的_id，以及运营商的operatorId,
   */
  async updateCategory_O(data) {
    // 查询要更新的品类
    const Category = this.ctx.model.Category;
    // const Operator = this.ctx.model.Operator;
    const updateInstance = await Category.findById(this.ctx.query._id);
    console.log('query什么样：' + JSON.stringify(this.ctx.query.operatorId));
    const Adjust = this.ctx.model.Adjust;
    const operatorId = await this.ctx.query.operatorId; // 运营商id
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
          status: '0',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {
      // 品类上架的状况
      try {
        const categoryAdjust = await Adjust.create({
          operatorId,
          object: 'c',
          objectId: this.ctx.query._id,
          action: '1', // 表明 是 修改申请
          verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: updatedData,
        });

        // 给平台发送通知,（前提是生成申请记录）并返回相关数据
        if (categoryAdjust) {
          const news = await this.sendNews(operatorId, updateInstance._id, categoryAdjust);

          return {
            status: '1',
            information: '提交修改申请成功',
            categoryAdjust,
            news,
          };
        }


      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '0',
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
    const operatorId = await this.ctx.query.operatorId;
    const id = await this.ctx.query._id;
    const deleteInstance = await Category.findById(id);
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
            status: '1',
            deleteResult,
          };
        }
        // 删除数量为空
        return {
          information: '删除失败',
          status: '0',
        };

      } catch (err) {
        console.log('err信息：' + err);
        return {
          information: '删除失败',
          status: '0',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {

      try {
        // 新增 删除申请记录
        const CDInstance = await Adjust.create({
          operatorId,
          object: 'c',
          objectId: this.ctx.query._id,
          action: '2', // 表明 是 删除申请
          verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: deleteData,
        });
        // console.log('service层：' + CDInstance);

        // 向平台发送消息
        if (CDInstance) {
          const news = await this.sendNews(operatorId, id, CDInstance);

          return {
            state: '1',
            information: '提交删除成功，请等待审核',
            CDInstance,
            news,
          };
        }

      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '0',
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
    const operatorId = await this.ctx.query.operatorId;
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
        operatorId,
        objectId: this.ctx.query._id,
        action: upOroff,
        verifyTime: null, // 审核时间
        timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
        changedData,
      });

      if (upInstance) {
        const news = await this.sendNews(operatorId, id, upInstance);

        return {
          information: '提交请求成功',
          status: '1',
          upInstance,
          news,
        };
      }


    } catch (err) {
      return {
        information: '提交请求失败',
        status: '0',
        error: err.message,
      };
    }
  }
}

module.exports = CategoryService;
