/**
 * 单品
 */
'use strict';

const { Service } = require('egg');

class ItemService extends Service {

  /**
 * 品类查询
 * 前端传入运营商id
 */
  async queryItem() {
    const Item = await this.ctx.model.Item;
    const query = await this.ctx.query;

    try {
      const findResult = await Item.find({ Operator: query.operatorID }).populate('Partition');
      if (findResult) {
        return {
          information: '查询单品成功',
          status: '0',
          findResult,
        };
      }
      // 没有匹配到
      return {
        information: '经查无此单品',
        status: '1',
        findResult,
      };
    } catch (err) {
      console.log('err信息：' + err);
      return {
        information: '查询单品成功',
        status: '0',
        error: err.message,
      };
    }


  }
  // 新增单品
  async addItem() {
    const Item = this.ctx.model.Item;
    try {
      const itemInstance = new Item(this.ctx.request.body);
      itemInstance.save();
      return itemInstance;
    } catch (err) {
      console.log(err);
      return {
        status: '1',
        information: '新增失败',
        error: err.message,
      };
    }

  }

  // 新增单品分区
  async addPartition() {
    const Partition = this.ctx.model.Partition;
    try {
      const partitionInstance = new Partition(this.ctx.request.body);
      partitionInstance.save();

      // 成功，返回相应值
      return {
        status: '0',
        partitionInstance,
        information: '新增单品分区成功',
      };
    } catch (err) {
      return {
        status: '1',
        information: '新增失败',
        error: err.message,
      };
    }
  }

  // 新增任务中断要求
  async addInterruption() {
    const data = await this.ctx.request.body;
    const Interrupt = this.ctx.model.Interrupt;
    try {
      const interruptInstance = new Interrupt(data);
      interruptInstance.save();
      // 若没有异常，则返回数据以及成功消息
      return {
        information: '新增成功',
        status: '0',
        interruptInstance,
      };
    } catch (err) {
      console.log('err信息：' + err);
      return {
        status: '1',
        information: '新增失败',
        error: err.message,
      };
    }
  }

  // 新增任务
  async addTask() {
    const Task = this.ctx.model.Task;
    const taskInstance = new Task(this.ctx.request.body);
    try {
      // const saveResult = taskInstance.save();
      taskInstance.save();
      // console.log('保存结果：' + result);
      // 成功返回的信息
      return {
        status: '0',
        information: '新增成功',
        taskInstance,

      };

    } catch (err) {
      // throw ('位置/serice/item/addTask' + err);
      console.log(err);
      return {
        status: '1',
        information: '新增失败',
        error: err.message,
      };
    }
  }
}
module.exports = ItemService;
