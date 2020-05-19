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
}
module.exports = ServicerController;
