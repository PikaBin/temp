/**
 * 此文件封装了运营商操作工单的接口：
 * 1.根据子订单生成工单
 * 2.根据某些查询条件 查询工单
 * 3.分配工单到指定专才
 */
'use strict';
const Controller = require('egg').Controller;
class WorkOrder extends Controller {

  // 生成工单：具体则是根据接到的订单，将其拆分成具体的一个个单品，
  // 从而根据单品生成工单
  // async createWorkorder() {
  //   const {ctx, service} = this;
  // }

  // 分配工单：运营商分配工单给专才
  async assignWorkorder() {
    const { ctx, service } = this;
    const servicerID = ctx.request.body.servicer_id;
    const workorderID = ctx.request.body.workorder_id;

    console.log('servicerID：' + servicerID);
    console.log('workorderID：' + workorderID);
    const result = await service.operator.workorder.assignWorkOrder(workorderID, servicerID);

    ctx.status = 200;
    ctx.body = result;
    // ctx.service.operator.workorder.assignWorkOrder(workorderID, servicerID, function(err, data) {
    //   if (err) console.log(err);
    //   ctx.status = 200;
    //   ctx.body = data;
    //   console.log('回调中的ctx是：' + JSON.stringify(ctx, null));
    //   console.log('controller的回调函数内的结果是：' + data);
    // });

    // console.log('controller结果是：' + result);
  }

  // 运营商 查询工单
  async queryWorkOrder() {
    const { ctx, service } = this;
    const { workorder_id } = ctx.request.body;
    const result = await service.operator.workorder.queryWorkOrder(workorder_id);
    ctx.status = 200;
    ctx.body = result;
  }

}

module.exports = WorkOrder;

