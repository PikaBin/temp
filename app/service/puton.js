/**
 * 用来实体的上下架，删除（从数据库中）
 */
'use strict';

const Controller = require('egg').Controller;

class QueryContrller extends Controller {

  /**
   * 根据分区id,查询任务
   */
  async queryTask() {
    // const partitionId = await this.ctx.query._id;
    // const Partition = this.ctx.model.Item.Partition;

  }
}

module.exports = QueryContrller;
