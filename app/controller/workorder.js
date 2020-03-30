/**
 * 工单控制
 */
'use strict';
const Controller = require('egg').Controller;

class workorderController extends Controller {
  // 新增工单
  async workorderAdd() {
    try {
      const workorderInstance = await this.ctx.service.workorder.workorderAdd();
      console.log('workorder内容：' + workorderInstance);
      this.ctx.status = 200;
      this.ctx.body = workorderInstance;
    } catch (err) {
      console.log('workorderController错误：' + err);
    }
  }
}
module.exports = workorderController;
