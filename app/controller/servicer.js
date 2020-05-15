/**
 * 专才
 */
'use strict';

const { Controller } = require('egg');
class ServicerController extends Controller {

  async queryServicer() {
    const result = await this.ctx.service.servicer.queryServicer();
    this.ctx.body = result;
  }
}
module.exports = ServicerController;
