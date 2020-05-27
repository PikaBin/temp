/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
/* eslint-disable quotes */
'use strict';
/**
 * 工单数据分析
 */

const { Service } = require('egg');

class workorderAnalysis extends Service {

  // 工单总数
  async totalWorkorder() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const number = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return number;
  }

  // 本月工单
  async workorderOnMonth() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const number = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o },
      },
      {
        $group: {
          _id: { dayofMonth: { $dayOfMonth: "$startTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // 计算日比
    const today = number[0].count;
    const yesterday = number[1].count;
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      today,
      number,
    };
  }

  // 本年工单
  async workorderOnYear() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const number = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o },
      },
      {
        $group: {
          _id: { month: { $month: "$startTime" } },
          count: { $sum: 1 },
        },
      },
    ]);
    return number;
  }

  // 意外中止的工单数
  async badworkorder() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const badnumber = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o, state: '3' },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return badnumber;
  }

  // 意外中止 每月
  async badworkorderOnMonth() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const number = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o, state: '3' },
      },
      {
        $group: {
          _id: { dayofMonth: { $dayOfMonth: "$startTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // 计算日比
    const today = number[0].count;
    const yesterday = number[1].count;
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      today,
      number,
    };
  }

  // 顺利完成，每月
  async goodworkorderOnMonth() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const number = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o, state: '0' },
      },
      {
        $group: {
          _id: { dayofMonth: { $dayOfMonth: "$startTime" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // 计算日比
    const today = number[0].count;
    const yesterday = number[1].count;
    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      today,
      number,
    };
  }

  // 单品排行榜
  async partitionRank() {
    const Workorder = this.ctx.model.Workorder.Workorder;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const partitionRank = await Workorder.aggregate([
      {
        $match: { operatorID: operatorId_o },
      },
      {
        $group: {
          _id: { partition: "$itemPartition" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return partitionRank;
  }
}
module.exports = workorderAnalysis;
