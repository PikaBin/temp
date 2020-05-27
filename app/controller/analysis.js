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

  // 年应付
  async debtOnYear() {
    const result = await this.ctx.service.operatorAnalysis.debtOnYear();
    this.ctx.body = result;
  }

  // 专才排行榜
  async servicerank() {
    const result = await this.ctx.service.operatorAnalysis.servicerRank();
    this.ctx.body = result;
  }

  // 工单总量
  async totalworkorder() {
    const result = await this.ctx.service.workorderAnalysis.totalWorkorder();
    this.ctx.body = result;
  }

  // 每月工单
  async workorderOnMonth() {
    const result = await this.ctx.service.workorderAnalysis.workorderOnMonth();
    this.ctx.body = result;
  }

  // 本年工单
  async workorderOnYear() {
    const result = await this.ctx.service.workorderAnalysis.workorderOnYear();
    this.ctx.body = result;
  }

  // 意外中止工单总数
  async badworkorder() {
    const result = await this.ctx.service.workorderAnalysis.badworkorder();
    this.ctx.body = result;
  }

  // 意外中止 每月
  async badworkorderOnMonth() {
    const result = await this.ctx.service.workorderAnalysis.badworkorderOnMonth();
    this.ctx.body = result;
  }

  // 意外中止 每年
  async badworkorderOnYear() {
    const result = await this.ctx.service.workorderAnalysis.badworkorderOnYear();
    this.ctx.body = result;
  }

  // 顺利完成 总数
  async goodworkorder() {
    const result = await this.ctx.service.workorderAnalysis.goodworkorder();
    this.ctx.body = result;
  }

  // 顺利完成 每月
  async goodworkorderOnMonth() {
    const result = await this.ctx.service.workorderAnalysis.goodworkorderOnMonth();
    this.ctx.body = result;
  }

  // 顺利完成 每年
  async goodworkorderOnYear() {
    const result = await this.ctx.service.workorderAnalysis.goodworkorderOnYear();
    this.ctx.body = result;
  }
  // 单品排行榜
  async partitionRank() {
    const result = await this.ctx.service.workorderAnalysis.partitionRank();
    this.ctx.body = result;
  }
}

module.exports = AnalysisController;
