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

  // 检测新增的订单，
  /**
   * 通过比较最新一条记录的订单id是否大于上一次检测订单id来判断是否更新，如果更新，然后取出新增的订单记录
   * 没有更新，返回给前端null,
   */


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
   * 根据订单表自动新增工单，通过检测订单表的更新从而新增对应的工单
   * 有bug,当运行findUpdatedOrder接口时，session.orderId就会更新，然后工单新增就会
   * 检测不到新的订单数据，然后对应的工单无法添加
   * // 此处有坑，mongodb数据库存入的时间会自动转化为零时区的时间，给以后的查询带来很大不便
   */
  async workorderAdd() {
    // console.log('body内容：' + JSON.stringify(this.ctx.request.body));
    const Workorder = this.ctx.model.Workorder;
    const newOrders = await this.findUpdatedOrder(); // 获取新增的订单
    const workorders = []; // 存放新增的工单，
    try {
      for (const order in newOrders) {
        // console.log('单个订单：' + order);
        const workorderInstance = new Workorder({
          // _id: 自动生成
          W_name: order.orderId,
          W_itemPartition: order.partitionId,
          orderID: order.orderId,
          W_operatorID: null,
          W_state: 2, // 由于是新生成的工单，所以工单状态默认为2(待分配)
          W_startTime: new Date(),
          W_serverTime: order.orderStartTime,
          requirement: order.remark,
          customerPhone: order.phone,
        });
        workorderInstance.save();
        workorders.push(workorderInstance);
      }
    } catch (err) {
      console.log('err信息：' + err);
      return {
        information: '工单新增失败',
        status: '1',
      };
    }

    return workorders;
  }

  /**
   * 派发工单_get
   * 前端传入待分配工单id,后端返回专才列表，
   * 获取要派发的工单，通过匹配专才的可接项目，在接项目数量，在职状态，来确定一个可用专才列表，从而返回给前端
   */
  async assignGet(badServicers) {
    try {
      const Servicer = this.ctx.model.Servicer;
      const Workorder = this.ctx.model.Workorder.Workorder;

      // 获取要派发的工单id
      const id = this.ctx.query._id;

      // 查询工单对应的item的_id
      const workorderInstance = await Workorder.findById(id).populate('itemPartition');
      const relatedItem = workorderInstance.itemPartition.itemID;
      const item = relatedItem.toString();
      // console.log(relatedItem, typeof (relatedItem));
      // console.log('长什么样子呢：' + workorderInstance);

      // 查找符合条件的专才（在职状态为正常，在接项目小于最大可接项目数量，可接项目与工单上的一致,

      // $in 操作符 表示servicerItem的元素 至少匹配itemname的一项,暂时
      const candidates = await Servicer.find({ $where: function() { return this.workordering < this.maxWorkOrder; },
        servicerStatus: true, servicerItem: { $in: [ item ] } });


      // 返回符合条件的专才，和已经拒单的专才(返回全部字段吗？)
      if (candidates) {
        return {
          status: '1',
          information: '查询成功，返回专才列表',
          candidates,
          badServicers,
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
    const workorderId = await this.ctx.query.workorderId; // 获取要派送的工单内容
    const servicerId = await this.ctx.query.servicerId; // 获取前端选中的专才

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
        return {
          information: '派单成功',
          status: '1',
          assignResult,
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


}

module.exports = WorkorderService;
