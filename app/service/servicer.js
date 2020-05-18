/**
 * 专才
 */

'use strict';
const Service = require('egg').Service;
class Servicer extends Service {

  // 查看专才
  async queryServicer() {
    const Servicer = this.ctx.model.Servicer;
    const query = await this.ctx.query;
    try {
      const findResult = await Servicer.find(query);

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      return {
        information: '查询成功，但是结果为空',
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
module.exports = Servicer;
