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

}

module.exports = Analysis;
