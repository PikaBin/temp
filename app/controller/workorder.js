/**
 * 工单管理
 */
'use strict';
const Controller = require('egg').Controller;

class workorderController extends Controller {

  // 查询工单
  async queryworkorder() {
    const result = await this.ctx.service.workorder.queryWorkorder();
    this.ctx.body = result;
  }

  // 发现新订单，并且返回给前端
  async findOrder() {
    try {
      const newOrder = await this.ctx.service.workorder.findUpdatedOrder();
      this.ctx.status = 200;
      this.ctx.body = newOrder;
    } catch (error) {
      console.log('findOrder控制层' + error);
    }
  }
  // 新增工单
  async workorderAdd() {
    try {
      const workorders = await this.ctx.service.workorder.workorderAdd();
      console.log('workorder内容：' + workorders);
      this.ctx.body = workorders;
    } catch (err) {
      console.log('workorderController错误：' + err);
    }
  }

  // 手动增加工单
  async workorderAdd_man() {
    const result = await this.ctx.service.workorder.workorderAdd_man();
    this.ctx.body = result;
  }

  // 手动增加工单日志
  async workorderlog_man() {
    const logInstance = await this.ctx.service.workorder.workorderlog_man();
    this.ctx.body = logInstance;
  }

  // 手动增加 分单
  async assign_man() {
    const assignInstance = await this.ctx.service.workorder.assign_man();
    this.ctx.body = assignInstance;
  }

  // 获取派发列表
  async assignGet() {

    try {
      const badServicers = await this.ctx.request.body.badServicers; // 沟通，让前端进行增添这个字段
      console.log('body:' + JSON.stringify(badServicers));
      const result = await this.ctx.service.workorder.assignGet(badServicers);
      this.ctx.body = {
        status: '1',
        result,
      };
    } catch (err) {
      console.log('err信息：' + err);
      this.ctx.body = {
        status: '0',
        information: '获取专才列表失败',
      };
    }
  }
}
module.exports = workorderController;
