/**
 * 单品分区service
 */
'use strict';

const Service = require('egg').Service;

class PartitionService extends Service {

  async queryPartiton() {
    const Partition = this.ctx.model.Item.Partition;
    const id = await this.ctx.query._id;

    try {
      const findResult = await Partition.findById(id);

      if (findResult) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      return {
        information: '查询成功,但是没有结果',
        status: '0',
      };
    } catch (err) {
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }


  }
}

module.exports = PartitionService;
