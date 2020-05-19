/**
 * 专才
 */

'use strict';
const Service = require('egg').Service;
class Servicer extends Service {

  // 查看专才
  async queryServicer() {
    const Servicer = this.ctx.model.Servicer.Servicer;
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

  // 专才合约增加
  async addContract() {
    const Contract = this.ctx.model.Servicer.Contract;
    const body = await this.ctx.request.body;

    try {
      const addResult = await Contract.create(body);

      if (addResult) {
        return {
          information: '添加合约成功',
          status: '1',
          addResult,
        };
      }

      // 添加为空
      return {
        information: '添加合约失败',
        status: '0',
      };
    } catch (err) {
      console.log('addContact: ', err);
      return {
        information: '添加合约失败',
        status: '0',
        error: err.message,
      };
    }

  }

  // 专才合约查看
  async queryContract() {
    const Contract = this.ctx.model.Servicer.Contract;
    const query = await this.ctx.query;

    try {
      const findResult = await Contract.find(query);

      if (findResult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findResult,
        };
      }

      // 查询为空
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

  // 审核专才申请


}
module.exports = Servicer;
