/**
 * 单品
 * 功能列表
 * 1.单品查询..
 * 2.新增单品..
 * 3.新增单品分区..
 * 4.新增单品任务中断要求..
 * 5.新增任务..
 * 6.编辑单品..
 * 7.上下架单品
 * 8.删除单品 .
 */
'use strict';

const { Service } = require('egg');

class ItemService extends Service {

  /**
 * 单品查询
 * 前端传入运营商id
 * 按加入时间降序
 */
  async queryItem() {
    const Item = await this.ctx.model.Item.Item;
    const query = await this.ctx.request.query;
    query.operatorID = await this.ctx.service.tools.getObjectId(query.operatorID);
    query._id = await this.ctx.service.tools.getObjectId(query._id);
    // const length = await this.ctx.service.tools.getJsonLength(query);
    console.log('query内容：' + JSON.stringify(query));
    // operatorID: operatorId, $or: [{ itemName: query.itemName }, { itemState: query.itemState }]
    try {
      const findResult = await Item.aggregate([{ $match: query },
        { $lookup: {
          from: 'partitions',
          localField: '_id',
          foreignField: 'itemID',
          as: 'partition',
        } }, {
          $lookup: {
            from: 'interrupts',
            localField: '_id',
            foreignField: 'itemId',
            as: 'interrupt',
          },
        }]);
      // 如果查询有结果
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
  /**
   * 根据单品id查单品
   */
  async queryByItem() {
    const query = await this.ctx.request.query;
    const id = await this.ctx.service.tools.getObjectId(query._id);
    console.log('id:' + id);
    const Item = this.ctx.model.Item.Item;
    const findResult = await Item.aggregate([{ $match: { _id: id } },
      { $lookup: {
        from: 'partitions',
        localField: '_id',
        foreignField: 'itemID',
        as: 'partition',
      } }, {
        $lookup: {
          from: 'interrupts',
          localField: '_id',
          foreignField: 'itemId',
          as: 'interrupt',
        },
      }]);
    return findResult;
  }
  /**
   * 新增单品
   * 有坑，就算新增失败，前端也不会报错，依旧返回数据，彷佛新增成功一样
   */
  async addItem() {
    const Item = await this.ctx.model.Item.Item;
    try {
      const itemInstance = new Item(this.ctx.request.body);
      await itemInstance.save();

      // 检测是否真正插入数据
      const ensure = await Item.findById(itemInstance._id);
      if (ensure) {
        return {
          information: '新增成功',
          status: '0',
          ensure,
        };
      }
      return {
        information: '新增失败，可能缺失数据',
        status: '1',
      };

    } catch (err) {
      console.log(err);
      return {
        status: '1',
        information: '新增失败',
        error: err.message,
      };
    }

  }

  /**
   * 新增单品分区
   */
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

  /**
   * 编辑单品分区
   */
  async updatePartition() {
    const Item = await this.ctx.model.Item.Item;
    const PartitionUpdate = this.ctx.model.Item.Partitionupdate;
    const updatedData = await this.ctx.request.body;
    const id = await this.ctx.query._id;

    const findResult = await Item.findById(id);

    try {
      // 判断单品是否上架
      if (findResult.itemState === '0') {
        const updateResult = await Item.updateOne({ _id: id }, updatedData);

        // 判断是否修改成功
        if (updateResult.nModified === 0) {
          return {
            information: '修改失败',
            status: '1',
          };
        }
        // 修改成功，返回数据
        return {
          information: '修改成功',
          status: '0',
          updateResult,
        };

      }
      // 若已上架，则提交修改申请
      const upInstance = new ItemUpdate({
        timestamp: Date.now(),
        ItemID: id, // 单品id
        // auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
        // auditorID: { type: String, default: null }, // 审核人ID
        // auditTime: { type: String, required: false }, // 审核时间
        // applyTime: Date, // 申请时间
        action: { type: String }, // up:上架，off:下架
        changedData: updatedData, // 因为修改而更新的数据
      });
      await upInstance.save();

      return {
        information: '提交修改申请成功',
        status: '0',
        upInstance,
      };


    } catch (err) {
      console.log('/service/item' + err);
      return {
        information: '提交修改失败',
        status: '1',
        error: err.message,
      };
    }

  }

  /**
   * 新增任务中断要求
   */
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

  /**
   * 新增任务
   */
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

  /**
   * 更新单品
   * 前端传入单品数据，
   * 若未上架则直接修改，若已上架则提交修改申请，
   */
  async updateItem() {
    const Item = await this.ctx.model.Item.Item;
    const ItemUpdate = this.ctx.model.Item.Itemupdate;
    const updatedData = await this.ctx.request.body;
    const id = await this.ctx.query._id;

    const findResult = await Item.findById(id);

    try {
      // 判断单品是否上架
      if (findResult.itemState === '0') {
        const updateResult = await Item.updateOne({ _id: id }, updatedData);

        // 判断是否修改成功
        if (updateResult.nModified === 0) {
          return {
            information: '修改失败',
            status: '1',
          };
        }
        // 修改成功，返回数据
        return {
          information: '修改成功',
          status: '0',
          updateResult,
        };

      }
      // 若已上架，则提交修改申请
      const upInstance = new ItemUpdate({
        timestamp: Date.now(),
        ItemID: id, // 单品id
        // auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
        // auditorID: { type: String, default: null }, // 审核人ID
        // auditTime: { type: String, required: false }, // 审核时间
        // applyTime: Date, // 申请时间
        action: { type: String }, // up:上架，off:下架
        changedData: updatedData, // 因为修改而更新的数据
      });
      await upInstance.save();

      return {
        information: '提交修改申请成功',
        status: '0',
        upInstance,
      };


    } catch (err) {
      console.log('/service/item' + err);
      return {
        information: '提交修改失败',
        status: '1',
        error: err.message,
      };
    }

  }
  /**
     * 删除单品
     * 判断是否上架
     */
  async deleteItem() {
    // const Item = this.ctx.model.Item.Item;
    // const DeleteItem = this.ctx.model.Item.Deleteitem;
  }

  /**
   * 上架单品
   */


}
module.exports = ItemService;
