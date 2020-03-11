'use strict';
/**
 * 用途：负责运营商基础信息维护
 * 具体功能：
 * 1.新增运营商
 * 2.更新运营商信息
 */

const { Service } = require('egg');

class OperatorInfo extends Service {

  /** 新增运营商  */
  async addOperator() {
    const Operator = await this.ctx.model.Operator;
    const operatorInstance = new Operator(this.ctx.request.body);
    operatorInstance.save(err => {
      if (err) {
        console.log(err);
        return;
      }
    });

    return operatorInstance;

  }
  /**
   * 更新前端数据应该分为两步，第一步展示原有的信息表单，前端进行修改完成，提交，第二步，后端更新数据库信息，重新定位到运营商信息页面
   * @param {JSON} data 前端传入的运营商信息表单
   */
  async updateOperator(data) {
    const Operator = await this.ctx.model.Operator;
    const updatedData = Operator.findByIdAndUpdate(data._id, data);
    return updatedData;

  }
  /**
  * 此处有个问题，如果查询没有得到结果，前端只会得到一个created的值；现在进行初步改进，加一个if判断；
  */
  async queryOperator() {
    const Operator = this.ctx.model.Operator;
    const foundData = await Operator.findById(this.ctx.query._id);
    if (foundData) {
      return foundData;
    }
    return null;
  }
}

module.exports = OperatorInfo;
