'use strict';
/**
 * 用途：负责运营商基础信息维护
 * 具体功能：
 * 1.新增运营商
 * 2.更新运营商信息
 * 3.查询运营商信息
 * 4.删除运营商信息（应该是平台拥有的功能）
 */

const { Service } = require('egg');

class OperatorInfo extends Service {

  // 运营商提交申请
  async submitAdjust(operatorId, object, objectId, changedData) {
    const Adjust = this.ctx.model.Adjust;
    let adjustInstance = {};
    try {
      adjustInstance = await Adjust.create({
        operatorId,
        object,
        objectId,
        action: '1', // 表明 是 修改申请
        verifyTime: null, // 审核时间
        timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
        changedData,
      });
      return adjustInstance;
    } catch (err) {
      console.log('submit', err);
      return null; // 如果失败传回空值
    }
  }

  // 运营商发送消息 给平台
  async sendNews(operatorId, objectId, adjust) {
    const Operator = this.ctx.model.Operator;
    const News = this.ctx.model.Verify.News;
    const operator = await Operator.findById(operatorId);
    const staffId = await this.ctx.service.tools.getObjectId('5ec7894745e65336184fd8ea'); // 注意这是写死的
    const news = await News.create({
      receiveId: staffId, // 消息接受对象的id
      senderId: operatorId,
      auditorName: operator.operatorName, // 发送消息者姓名
      object: 'o', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
      action: 't', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
      detailObject: 'o', // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
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

  /** 新增运营商  */
  async addOperator() {
    const Operator = await this.ctx.model.Operator;
    const req = this.ctx.request.body;
    req.password = (await this.ctx.service.tools.md5(req.password)).toString();
    console.log('password是什么类型' + typeof (req.password));
    const operatorInstance = new Operator(req);
    operatorInstance.save(err => {
      if (err) {
        console.log(err);
        return;
      }
    });

    return operatorInstance;

  }
  /**
   * 更新运营商信息，提交申请，发送通知
   * 前端传入运营商id与修改后的数据
   */
  async updateOperator() {
    // const Operator = this.ctx.model.Operator;
    const operatorId = await this.ctx.query.operatorId;
    const data = await this.ctx.request.body;

    // 提交申请
    const object = 'o';
    const adjustInstance = await this.submitAdjust(operatorId, object, operatorId, data);

    // 如果提交申请成功，则发送通知

    if (adjustInstance) {
      const news = await this.sendNews(operatorId, operatorId, adjustInstance);

      // 如果发送通知成功
      if (news) {
        return {
          information: '提交申请成功',
          status: '1',
          news,
          adjustInstance,
        };
      }
    }

    // 提交审核失败
    return {
      information: '提交申请失败',
      status: '0',
    };


  }
  /**
  * 此处有个问题，如果查询没有得到结果，前端只会得到一个created的值；
  * 现在进行初步改进，加一个if判断；
  */
  async queryOperator() {
    const Operator = this.ctx.model.Operator;
    const foundData = await Operator.findById(this.ctx.query._id);
    if (foundData) {
      return foundData;
    }
    return null;
  }

  // 修改密码
  async changePassword() {
    const data = await this.ctx.request.body;
    const Staff = this.ctx.model.Staff;
    const Operator = this.ctx.model.Operator;
    const character = await this.ctx.query.character;
    const id = await this.ctx.query._id;
    data.password = await this.ctx.service.tools.md5(data.password);
    const idO = await this.ctx.service.tools.getObjectId(id);
    // console.log(idO);

    // 判断什么角色
    if (character === 'o') {
      const update = await Operator.findByIdAndUpdate(idO, data);
      // const update = await Operator.updateOne({ _id: id }, { data });
      console.log('运营商：', update);
      if (update) {
        return {
          status: '1',
          information: '修改密码成功',
        };
      }
      return {
        status: '0',
        information: '修改失败',
      };
    }

    const update = await Staff.findByIdAndUpdate(idO, data);
    // console.log('平台员工：', update);
    if (update.nModified !== 0) {
      return {
        status: '1',
        information: '修改密码成功',
      };
    }

    return '修改失败';
  }

}

module.exports = OperatorInfo;
