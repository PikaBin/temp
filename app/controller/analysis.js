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

  // 成交总量
  async totalcount() {
    const result = await this.ctx.service.operatorAnalysis.totalCount();
    this.ctx.body = result;
  }

  // 成交量日数据
  async countOnDay() {
    const result = await this.ctx.service.operatorAnalysis.countOnDay();
    this.ctx.body = result;
  }

  // 成交量月数据
  async countOnMonth() {
    const result = await this.ctx.service.operatorAnalysis.countOnMonth();
    this.ctx.body = result;
  }

  // 成交量年数据
  async countOnYear() {
    const result = await this.ctx.service.operatorAnalysis.countOnYear();
    this.ctx.body = result;
  }

  // 实收账款
  async totalCash() {
    const result = await this.ctx.service.operatorAnalysis.totalCash();
    this.ctx.body = result;
  }

  // 本月实收账款
  async cashOnMonth() {
    const result = await this.ctx.service.operatorAnalysis.cashOnMonth();
    this.ctx.body = result;
  }

  // 本年实收账款
  async cashOnYear() {
    const result = await this.ctx.service.operatorAnalysis.cashOnYear();
    this.ctx.body = result;
  }

  // 应付账款总额
  async totaldebt() {
    const result = await this.ctx.service.operatorAnalysis.totaldebt();
    this.ctx.body = result;
  }

  // 月应付
  async debtOnMonth() {
    const result = await this.ctx.service.operatorAnalysis.debtOnMonth();
    this.ctx.body = result;
  }
}

module.exports = AnalysisController;
