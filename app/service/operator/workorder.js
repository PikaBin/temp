/**
 * 与controller相对应，封装关于工单workorder的业务操作
 */
'use strict';
const Service = require('egg').Service;

class Workorder extends Service {
  // 创建工单

  // 分配工单,调用场景：根据已生成的工单分配给专才, serviceID, callback
  /**
   * findByIdAndUpdate()此函数只会返回查询到的记录，而不会返回更新后的结果记录
   * 暂时的解决办法是更新成功后再执行一次查询然后把结果返回；（这个应该可以改进）
   * @param {String} workorderID 工单id
   * @param {String} serviceID 专才id
   * @return {object} result 更新后的结果记录
   */
  async assignWorkOrder(workorderID, serviceID) {
    const WorkOrder = await this.ctx.model.Workorder;
    await WorkOrder.findByIdAndUpdate(workorderID, { W_servicer: serviceID });
    const result = WorkOrder.findById(workorderID);
    console.log('最终结果为：' + result);
    return result;

    // 错误示例
    // await WorkOrder.findByIdAndUpdate(workorderID, { W_servicer: serviceID })
    //   .exec(function() {
    //     console.log('exec函数');
    //     WorkOrder.findById(workorderID, (err, workorder) => {
    //       if (err) console.log(err);
    //       console.log('callback function' + workorder);
    //       callback(null, workorder);
    //     });
    //   });

  }

  // 依据工单id查看工单
  /**
   * @param {String} workorderID 查询的工单id
   * @return {object} result 查询得到的结果记录
   */
  async queryWorkOrder(workorderID) {
    const WorkOrder = await this.ctx.model.Workorder;
    const result = await WorkOrder.findById(workorderID);
    return result;
  }

}

module.exports = Workorder;
