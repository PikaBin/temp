/**
 * 单品分区管理
 */
'use strict';
const Controller = require('egg').Controller;
class PartitionController extends Controller {

  async queryPartition() {
    const result = await this.ctx.service.partition.queryPartiton();
    this.ctx.body = result;
  }
}

module.exports = PartitionController;