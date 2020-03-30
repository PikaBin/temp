/**
 * 工单service
 */
'use strict';

const Service = require('egg').Service;

class WorkorderService extends Service {

  // 新增工单
  async workorderAdd() {
    console.log('body内容：' + JSON.stringify(this.ctx.request.body));
    const Workorder = this.ctx.model.Workorder;
    const workorderInstance = new Workorder(this.ctx.request.body);
    workorderInstance.save(err => {
      console.log('workorderService错误' + err);
    });
    return workorderInstance;
  }

}

module.exports = WorkorderService;
