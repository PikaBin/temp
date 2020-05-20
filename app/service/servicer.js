/**
 * 专才
 */

'use strict';
const Service = require('egg').Service;
class Servicer extends Service {


  /**
   * 运营商发送消息向专才
   * @param {ObjectId} operatorId 发消息的运营商
   * @param {ObjectId} servicerApplyId 专才申请表记录id
   * @param {ObjectId} servicerId 接受消息的专才id
   */
  async sendServicer(operatorId, servicerApplyId, servicerId) {
    const Operator = this.ctx.model.Operator;
    const News = this.ctx.model.Verify.News;
    const operator = await Operator.findById(operatorId);
    const ServicerId = await this.ctx.service.tools.getObjectId(servicerId);
    const news = await News.create({
      receiveId: ServicerId, // 消息接受方的id
      senderId: operatorId,
      auditorName: operator.operatorName, // 发送消息者姓名
      object: 'o', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
      action: 'q', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
      detailObject: 'I', // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
      detailObjectId: servicerApplyId, // 具体处理对象id
      result: '0', // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
      timestamp: Date.now(),
      content: '系统已经审核您的申请，请注意查收',
    });

    if (news) {
      return news;
    }
    return null;
  }

  // 通用的查询方法
  async query(model, query) {
    try {
      const findResult = await model.find(query);

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      return {
        information: '查询成功，但是结果为空',
        status: '0',
      };

    } catch (err) {
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }

  }

  // 查看专才
  async queryServicer() {
    const Servicer = this.ctx.model.Servicer.Servicer;
    const query = await this.ctx.query;
    const result = await this.query(Servicer, query);
    return result;
  }

  // 专才合约增加
  async addContract() {
    const Contract = this.ctx.model.Servicer.Contract;
    const body = await this.ctx.request.body;

    try {
      const addResult = await Contract.create(body);

      if (addResult) {
        return {
          information: '添加合约成功',
          status: '1',
          addResult,
        };
      }

      // 添加为空
      return {
        information: '添加合约失败',
        status: '0',
      };
    } catch (err) {
      console.log('addContact: ', err);
      return {
        information: '添加合约失败',
        status: '0',
        error: err.message,
      };
    }

  }

  // 专才合约查看
  async queryContract() {
    const Contract = this.ctx.model.Servicer.Contract;
    const query = await this.ctx.query;

    const result = await this.query(Contract, query);
    return result;
  }

  // 查看专才申请
  async queryServicerApply() {
    const ServicerApply = await this.ctx.model.Servicer.ServicerApply;
    const query = await this.ctx.query;

    const result = await this.query(ServicerApply, query);
    return result;
  }

  // 审核专才申请
  async verifyServicer() {
    const applyData = await this.ctx.request.body;
    const Servicer = this.ctx.model.Servicer.Servicer;
    const ServicerApply = this.ctx.model.Servicer.ServicerApply;
    const operatorId = await this.ctx.query.operatorId;
    const applyId = applyData._id;
    // 处理申请
    try {
      if (applyData.state === '1') {
        // 审核通过，执行专才申请的操作
        const updateResult = await Servicer.updateOne({ _id: applyData.servicerId }, { $push: { servicerItem: applyData.itemId },
          reason: applyData.reason });

        if (updateResult.nModified !== 0) {
          // 操作成功，改变申请表状态
          await ServicerApply.updateOne({ _id: applyId }, { state: '1' });

          // 发送消息，并返回相关数据
          const servicerId = applyData.servicerId;
          const news = await this.sendServicer(operatorId, applyId, servicerId);
          return {
            information: '审核通过成功',
            status: '1',
            news,
          };
        }

        // 更新失败
        return {
          information: '审核通过失败，数据库更新失败',
          status: '2',
        };
      }

      // 审核不通过
      await ServicerApply.updateOne({ _id: applyId }, { state: '2' });
      const servicerId = applyData.servicerId;
      const news = await this.sendServicer(operatorId, applyData._id, servicerId);
      return {
        information: '审核不通过成功',
        status: '1',
        news,
      };
    } catch (err) {
      console.log('verifyServicer', err);
      return {
        information: '审核异常',
        status: '0',
        error: err.message,
      };
    }

  }

}
module.exports = Servicer;
