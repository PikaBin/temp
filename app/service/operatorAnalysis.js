/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
/* eslint-disable quotes */
'use strict';
/**
 * 运营商数据分析
 */
const { Service } = require('egg');

class Analysis extends Service {
  /**
   * 通用的计算总量方法
     * @param {model} Target 目标model
     * @param {attr} attr 要统计的属性
     * @param {ObjctId} id 对应的运营商id
     */
  async Volume(Target, attr, id) {
    try {
      // 获取总额
      const result = await Target.aggregate([
        {
          $match: { _id: id },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: attr },
          },
        }]);
      console.log('让我看看总额是多少：', result);

      return {
        status: '1',
        information: '获取成功',
        result,
      };

    } catch (err) {
      console.log('数量总额：', err);
      return {
        information: '获取失败',
        status: '0',
        error: err.message,
      };
    }
  }

  // 运营商总销售额
  async operatorSale() {

    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { operator: "$workorder.operatorID" },
          saleAmount: { $sum: "$cost" },
        },
      },
    ]);

    let target; // 目标数据
    console.log(sale.length);
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      //   console.log('数据中的：', operatorID);
      if (operatorID == operatorId) {
        target = sale[i].saleAmount;
      }
    }

    return target;
  }

  // 运营商销售额本月数据
  async operatorOnMonth() {

    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$orderTime" }, operator: "$workorder.operatorID" },
          saleAmount: { $sum: "$cost" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    const target = []; // 目标数据
    // console.log(sale.length);
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      if (operatorID == operatorId) {
        target.push(sale[i]);
      }
    }

    // 计算日比
    const today = target[0].saleAmount;
    const yesterday = target[1].saleAmount;

    const ratio = (today - yesterday) / yesterday * 100;
    // console.log(ratio);

    return {
      simpleRatio: ratio.toFixed(2),
      todaySale: today,
      target,
    };


  }

  // 运营商销售额本年数据
  async operatorOnYear() {
    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { month: { $month: "$orderTime" }, operator: "$workorder.operatorID" },
          saleAmount: { $sum: "$cost" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    const target = []; // 目标数据
    // console.log(sale.length);
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      if (operatorID == operatorId) {
        target.push(sale[i]);
      }
    }

    return target;
  }

  // 成交量总额
  async totalCount() {
    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { operator: "$workorder.operatorID" },
          count: { $sum: 1 },
        },
      },
    ]);

    let target; // 目标数据
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      // console.log('数据中的：', operatorID);
      if (operatorID == operatorId) {
        target = sale[i].count;
      }
    }
    return target;
  }

  // 成交量每日
  async countOnDay() {
    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { dayOfYear: { $dayOfYear: "$orderTime" }, operator: "$workorder.operatorID" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    const target = []; // 目标数据
    // console.log(sale.length);
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      if (operatorID == operatorId) {
        target.push(sale[i]);
      }
    }

    return target;
  }
  // 成交量本月数量
  async countOnMonth() {
    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$orderTime" }, operator: "$workorder.operatorID" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    const target = []; // 目标数据
    // console.log(sale.length);
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      if (operatorID == operatorId) {
        target.push(sale[i]);
      }
    }

    // 计算日比
    const today = target[0].count;
    const yesterday = target[1].count;

    const ratio = (today - yesterday) / yesterday * 100;
    // console.log(ratio);

    return {
      simpleRatio: ratio.toFixed(2),
      todayCount: today,
      target,
    };
  }

  // 成交量本年数据
  async countOnYear() {
    const operatorId = await this.ctx.query.operatorId;
    const Order = this.ctx.model.Order;
    const sale = await Order.aggregate([
      {
        $lookup: {
          from: 'workorders',
          localField: '_id',
          foreignField: 'orderID',
          as: 'workorder',
        },
      },
      {
        $group: {
          _id: { month: { $month: "$orderTime" }, operator: "$workorder.operatorID" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    const target = []; // 目标数据
    // console.log(sale.length);
    for (let i = 0; i < sale.length; i++) {
      const operatorID = sale[i]._id.operator[0];
      if (operatorID == operatorId) {
        target.push(sale[i]);
      }
    }

    return {
      target,
    };
  }

  // 实收账款
  async totalCash() {
    const Cashflow = this.ctx.model.Cashflow;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const cash = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: null,
          totalCash: { $sum: "$operatorReceivable" },
        },
      },
    ]);

    return cash;
  }

  // 实收账款本月数据
  async cashOnMonth() {
    const Cashflow = this.ctx.model.Cashflow;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const cash = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: { dayOfMonth: { $dayOfMonth: "$addTime" } },
          cash: { $sum: "$operatorReceivable" },
        },
      },
    ]);


    // 计算日比
    const today = cash[0].cash;
    const yesterday = cash[1].cash;

    const ratio = (today - yesterday) / yesterday * 100;
    // console.log(ratio);

    return {
      simpleRatio: ratio.toFixed(2),
      todayCount: today,
      cash,
    };

  }

  // 实收账款本年数据
  async cashOnYear() {
    const Cashflow = this.ctx.model.Cashflow;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const cash = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: { month: { $month: "$addTime" } },
          totalCash: { $sum: "$operatorReceivable" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return cash;

  }


  // 应付账款总额
  async totaldebt() {
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);
    const Cashflow = this.ctx.model.Cashflow;
    const debt = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: null,
          debt: { $sum: "$serverReceivable" },
        },
      },
    ]);
    return debt;
  }

  // 月应付
  async debtOnMonth() {
    const Cashflow = this.ctx.model.Cashflow;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const debt = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: { dayOfMonth: { $dayOfMonth: "$addTime" } },
          debt: { $sum: "$serverReceivable" },
        },
      },
    ]);

    // 计算日比
    const today = debt[0].debt;
    const yesterday = debt[1].debt;

    const ratio = (today - yesterday) / yesterday * 100;

    return {
      simpleRatio: ratio.toFixed(2),
      todayDebt: today,
      debt,
    };

  }

  // 年应付
  async debtOnYear() {
    const Cashflow = this.ctx.model.Cashflow;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const debt = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: { month: { $month: "$addTime" } },
          debt: { $sum: "$serverReceivable" },
        },
      },
    ]);

    return debt;
  }

  // 专才排行榜
  async servicerRank() {
    const Cashflow = this.ctx.model.Cashflow;
    const operatorId = await this.ctx.query.operatorId;
    const operatorId_o = await this.ctx.service.tools.getObjectId(operatorId);

    const servicerank = await Cashflow.aggregate([
      {
        $match: { operatorId: operatorId_o },
      },
      {
        $group: {
          _id: { servicer: "$servicerId" },
          sale: { $sum: "$serverReceivable" },
        },
      },
      {
        $sort: { sale: -1 },
      },
    ]);

    return servicerank;
  }
}

module.exports = Analysis;
