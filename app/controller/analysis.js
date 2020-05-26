/**
 * 品类
 */
'use strict';

const { Controller } = require('egg');

class AnalysisController extends Controller {

  // 运营商总销售额
  async operatorSale() {
    const result = await this.ctx.service.operatorAnalysis.operatorSale();
    this.ctx.body = result;
  }

  // 本月数据额
  async operatorOnMonth() {
    const result = await this.ctx.service.operatorAnalysis.operatorOnMonth();
    this.ctx.body = result;
  }

  // 本年销售数据
  async operatorOnYear() {
    const result = await this.ctx.service.operatorAnalysis.operatorOnYear();
    this.ctx.body = result;
  }
}

module.exports = AnalysisController;
