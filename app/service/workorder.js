/* eslint-disable quotes */
/* eslint-disable object-shorthand */
/* eslint-disable jsdoc/require-param */
/**
 * 工单service
 */
'use strict';

const Service = require('egg').Service;

class WorkorderService extends Service {

  /**
   * 向专才发送消息
   */
  async sendServicer(operatorId, workorderId, servicerId) {
    const Operator = this.ctx.model.Operator;
    const News = this.ctx.model.Verify.News;
    const operator = await Operator.findById(operatorId);
    const ServicerId = await this.ctx.service.tools.getObjectId(servicerId);
    const news = await News.create({
      receiveId: ServicerId, // 消息接受方的id
      senderId: operatorId,
      auditorName: operator.operatorName, // 发送消息者姓名
      object: 'o', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
      action: 'p', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
      detailObject: 'g', // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
      detailObjectId: workorderId, // 具体处理对象id
      result: '0', // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
      timestamp: Date.now(),
      content: '系统已经派送一份工单，请注意查收',
      addTime: new Date(), // 消息增加时间
    });

    if (news) {
      return news;
    }
    return null;
  }


  /**
   * 查询工单
   * 前端传入查询参数
   */
  async queryWorkorder() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const query = await this.ctx.query;

    // 查询工单
    try {
      const findResult = await Workorder.find(query).sort({ startTime: -1 });
      if (findResult) {
        return {
          status: '0',
          information: '查询成功',
          findResult,
        };
      }

      return {
        status: '1',
        information: '查询失败',
      };
    } catch (err) {
      console.log('/service/workorder', err);
      return {
        status: '1',
        error: err.message,
      };
    }

  }


  // 手动新增工单，测试用
  async workorderAdd_man() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const workorderInstance = new Workorder(this.ctx.request.body);
    try {
      workorderInstance.save();
      return {
        workorderInstance,
        status: '0',
        information: '新增成功',
      };
    } catch (err) {
      console.log(err);
      return {
        status: '1',
        error: err.message,
        information: '新增失败',
      };
    }
  }

  /**
   * 新增工单日志表 测试做数据
   */
  async workorderlog_man() {
    const WorkorderLog = this.ctx.model.Workorder.Workorderlog;
    const addData = this.ctx.request.body;
    // console.log(addData);
    try {
      const logInstance = await WorkorderLog.create(addData);
      return {
        status: '0',
        information: '新增成功',
        logInstance,
      };
    } catch (err) {
      console.log(err);
      return {
        status: '1',
        error: err.message,
        information: '新增失败',
      };
    }
  }

  /**
   * 新增分单表 测试用
   */
  async assign_man() {
    const Assign = this.ctx.model.Workorder.Assign;
    const addData = this.ctx.request.body;
    // console.log(addData);
    try {
      const assginInstance = await Assign.create(addData);
      return {
        status: '0',
        information: '新增成功',
        assginInstance,
      };
    } catch (err) {
      console.log(err);
      return {
        status: '1',
        error: err.message,
        information: '新增失败',
      };
    }
  }

  /**
   * 派发工单_get
   * 前端传入待分配工单id,后端返回专才列表，
   * 获取要派发的工单，通过匹配专才的可接项目，在接项目数量，在职状态，排除已经拒单的专才，来确定一个可用专才列表，从而返回给前端
   */
  async assignGet() {
    try {
      const Servicer = this.ctx.model.Servicer.Servicer;
      const Workorder = this.ctx.model.Workorder.Workorder;
      const Assign = this.ctx.model.Workorder.Assign;

      // 获取要派发的工单id
      const id = this.ctx.query._id;

      // 查询工单对应的item的_id
      const workorderInstance = await Workorder.findById(id).populate('itemPartition');
      const relatedItem = workorderInstance.itemPartition.itemID;
      const item = relatedItem.toString();
      // console.log(relatedItem, typeof (relatedItem));
      // console.log('长什么样子呢：' + workorderInstance);

      // 获取已经拒单的专才
      const assignInstance = await Assign.find({ workorderID: id, $where: function() { return this.log.length > 0; } });
      console.log('拒单专才：' + assignInstance);
      // 取出拒单的专才id,存放在数组里面
      const badServicers = [];
      for (let i = 0; i < assignInstance.length; i++) {
        // 取出对应的log
        const log = assignInstance[i].log;
        for (let j = 0; j < log.length; j++) {
          const badServicer = log[j].servicerID;
          badServicers.push(badServicer);
        }
      }
      // console.log('log符合条件吗：', badServicers);

      // 查找符合条件的专才（在职状态为正常，在接项目小于最大可接项目数量，可接项目与工单上的一致,排除掉拒单专才）

      // $in 操作符 表示servicerItem的元素 至少匹配itemname的一项
      const candidates = await Servicer.find({ $where: function() { return this.workordering < this.maxWorkOrder; },
        servicerStatus: true, servicerItem: { $in: [ item ] }, _id: { $nin: badServicers } });

      // 返回符合条件的专才，和已经拒单的专才(返回全部字段吗？)
      if (candidates) {
        return {
          status: '1',
          information: '查询成功，返回专才列表',
          candidates,
        };
      }

      return {
        status: '0',
        information: '查询成功，但没有合适的专才',
      };


    } catch (err) {
      console.log('assignGet', err);
      return {
        status: '0',
        information: '查询出现了错误',
        error: err.message,
      };
    }


  }

  /**
   * 派发工单_post
   * 获取前端选择的专才，将工单信息与专才信息写入派单表中，
   * 问题；在这一步是否要更改工单的状态，默认状态是待分配，应该是专才端确认或者拒单后才改变分单表的状态
   * 运营商端要重新选择专才，从而派发，但是在返回的专才列表中，会加上已经拒单的专才，前端予以标注
   */
  async assign_post() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const workorderId = await this.ctx.query.workorderId; // 获取要派送的工单内容
    const servicerId = await this.ctx.query.servicerId; // 获取前端选中的专才
    const operatorId = await this.ctx.query.operatorId; // 负责派单的运营商id

    // 向派单表中插入新记录
    const Assign = this.ctx.model.Workorder.Assign;
    try {
      const assignResult = await Assign.create({
        workorderID: workorderId, // 派发的工单
        // state: { type: String, required: true, default: '1' }, // 状态,默认为 1 （0 – 拒单 / 1 – 待分配 / 2 - 已确认）
        servicerID: servicerId, // 分配的专才id
        startTime: new Date(), // 某一次派单的开始时间
      });

      // 更新派单表中的日志 暂不使用
      // Assgin.updateOne({ workorderID: workorder._id }, { $push: { log: { time: Date.now(), servicer: servicer.servicerId } } });

      if (assignResult) {
        // 更新工单状态为已派单未进行
        // eslint-disable-next-line no-unused-vars
        const updateState = await Workorder.updateOne({ _id: workorderId }, { state: '5' });
        // console.log('分配后的工单状态是否改变 ' + updateState);

        // 向专才发送消息
        const news = await this.sendServicer(operatorId, workorderId, servicerId);
        return {
          information: '派单成功',
          status: '1',
          assignResult,
          news,
        };
      }

      return {
        information: '派单失败',
        status: '0',
      };
    } catch (err) {
      console.log('assign_post', err);
      return {
        information: '派单异常',
        status: '0',
        error: err.message,
      };
    }

  }

  // 检测拒单情况，然后改变状态
  async isRefuse() {
    const Assign = this.ctx.model.Workorder.Assign;

    try {
      const refuseInstances = await Assign.find({ state: '0' }).limit(1);

      if (refuseInstances.length !== 0) {
        // 循环改变状态
        for (let i = 0; i < refuseInstances.length; i++) {
          const refuse = refuseInstances[i];
          // console.log('拒单的记录：', refuse);

          await Assign.updateOne({ _id: refuse._id }, { state: '1' });
        }
        console.log('自动检测拒单正在执行');
      }
      console.log('没有拒单状况出现');
    } catch (err) {
      console.log('isRefuse: ' + err);
      return {
        information: '自动拒单系统出现异常',
        error: err.message,
      };
    }
  }

  // 查看工单反馈记录
  async checkWorkorder() {
    const query = await this.ctx.query;
    const WorkorderLog = this.ctx.model.Workorder.Workorderlog;
    try {
      const workorderLogs = await WorkorderLog.find(query);
      // console.log('工单日志是：' + workorderLogs);
      if (workorderLogs.length !== 0) {
        return {
          information: '查询工单反馈成功',
          status: '1',
          workorderLogs,
        };
      }
      // 查询为空
      return {
        information: '查询成功，但结果为空',
        status: '0',
      };

    } catch (err) {
      console.log('checkworkorder', err);
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }


  }
}

module.exports = WorkorderService;
