/**
 * 单品控制器
 */
'use strict';
const { Controller } = require('egg');
class itemController extends Controller {

  // 新增单品
  async addItem() {
    try {
      const itemInstance = await this.ctx.service.item.addItem();
      this.ctx.status = 200;
      this.ctx.body = itemInstance;
    } catch (err) {
      console.log('itemController error：' + err);
    }


  }

  // 新增任务中断要求表
  async addInterrupt() {
    try {
      const result = await this.ctx.service.item.addInterruption();
      this.ctx.body = result;
    } catch (err) {
      console.log(err);
      this.ctx.body = {
        status: '0',
        information: '新增失败',
      };
    }
  }

  // 新增分区表
  async addPartition() {
    const result = await this.ctx.service.item.addPartition();
    this.ctx.body = result;
  }

  // 新增任务
  async addTask() {
    const result = await this.ctx.service.item.addTask();
    this.ctx.body = result;
  }
}

module.exports = itemController;
