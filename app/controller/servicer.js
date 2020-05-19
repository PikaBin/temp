/**
 * 专才
 */
'use strict';

const { Controller } = require('egg');
class ServicerController extends Controller {

  // 查询专才
  async queryServicer() {
    const result = await this.ctx.service.servicer.queryServicer();
    this.ctx.body = result;
  }

  // 新增专才合约表
  async addContract() {
    const result = await this.ctx.service.servicer.addContract();
    this.ctx.body = result;
  }

  // 查看专才合约
  async queryContract() {
    const result = await this.ctx.service.servicer.queryContract();
    this.ctx.body = result;
  }

  // 查看专才申请
  async queryServicerApply() {
    const result = await this.ctx.service.servicer.queryServicerApply();
    this.ctx.body = result;
  }

  // 审核专才申请
  async verifyApply() {
    const result = await this.ctx.service.servicer.verifyServicer();
    this.ctx.body = result;
  }
}
module.exports = ServicerController;
