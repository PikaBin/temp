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
   * 发消息
   * @param {ObjectId} operatorId 运营商id
   * @param {ObjectId} objectId 申请审核的对象id
   * @param {ObjectId} adjust 申请记录
   */
  async sendNews(operatorId, objectId, adjust) {
    const Operator = this.ctx.model.Operator;
    const News = this.ctx.model.Verify.News;
    const operator = await Operator.findById(operatorId);
    const staffId = await this.ctx.service.tools.getObjectId('5ecf718fea085632dc5e02d2'); // 注意这是写死的
    const news = await News.create({
      receiveId: staffId, // 消息接受对象的id
      senderId: operatorId,
      auditorName: operator.operatorName, // 发送消息者姓名
      object: 'o', // 发送对象标识 o:运营商，p:平台，z:专才，y:用户
      action: 't', // 动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
      detailObject: 'I', // 具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
      detailObjectId: objectId, // 具体处理对象id
      result: '0', // 处理结果 0 – 未处理 / 1 – 成功 / 2 – 不成功
      timestamp: Date.now(),
      verifiedData: adjust, // 存放相关中间表数据
    });

    if (news) {
      return news;
    }
    return null;
  }

  /**
 * 单品查询
 * 前端传入运营商id
 * 按加入时间降序
 */
  async queryItem() {

    const Item = await this.ctx.model.Item.Item;
    const query = await this.ctx.request.query;
    console.log('operatorID' + query.operatorID);
    query.operatorID = await this.ctx.service.tools.getObjectId(query.operatorID);
    // query._id = await this.ctx.service.tools.getObjectId(query._id);

    console.log('query内容：' + JSON.stringify(query));

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
        }, {
          $sort: { itemAddTime: -1 },
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
    query._id = await this.ctx.service.tools.getObjectId(query._id);
    console.log('query' + JSON.stringify(query));
    const Item = this.ctx.model.Item.Item;
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
    return findResult;
  }
  /**
   * 新增单品
   * 有坑，就算新增失败，前端也不会报错，依旧返回数据，彷佛新增成功一样
   */
  async addItem() {
    const Item = await this.ctx.model.Item.Item;
    try {
      // 拼接新增单品的全部数据
      const fields = await this.ctx.service.uploadMore.uploadMore();
      const data = fields.fields;
      // console.log('数据是什么：', data);
      data.itemImages = fields.files;
      const addResult = await Item.create(data);

      // 检测是否真正插入数据
      if (addResult) {
        return {
          information: '新增成功',
          status: '0',
          addResult,
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
    const Partition = this.ctx.model.Item.Partition;
    try {
      const partitionInstance = new Partition(this.ctx.request.body);
      await partitionInstance.save();

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

  // 查询单品分区，根据单品id
  async queryPartition() {
    const Partition = this.ctx.model.Item.Partition;
    const id = await this.ctx.query.partitionId;
    const findResult = await Partition.findById(id);

    if (findResult) {
      return findResult;
    }
    return '查询结果为空';
  }
  /**
   * 编辑单品分区
   */
  async updatePartition() {
    const Item = await this.ctx.model.Item.Item;
    const Partition = await this.ctx.model.Item.Partition;
    const PartitionUpdate = this.ctx.model.Item.Updatepartition;
    const updatedData = await this.ctx.request.body;
    const id = await this.ctx.query._id;

    const partitionInstance = await Partition.findById(id);
    const belongItem = await Item.findById(partitionInstance.itemID);
    console.log(partitionInstance, belongItem);
    try {
      // 判断单品是否上架
      if (belongItem.itemState === '0') {
        const updateResult = await Partition.updateOne({ _id: id }, updatedData);

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
      const upInstance = new PartitionUpdate({
        timestamp: Date.now(),
        partitionID: id, // 分区id
        // auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
        // auditorID: { type: String, default: null }, // 审核人ID
        // auditTime: { type: String, required: false }, // 审核时间
        // applyTime: Date, // 申请时间
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
   * 删除单品分区,以及下面的任务分区
   * @param {String}id 分区id
   */
  async deletePartition(id) {
    const Partition = this.ctx.model.Item.Partition;
    const deletePartition = this.ctx.model.Item.Deletepartition;
    const deleteData = await this.ctx.request.body;

    // 查询所属单品
    const belongItem = await Partition.findById(id).populate('itemID', 'itemState');
    // console.log('populate结果' + belongItem);
    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (belongItem.itemID.itemState === '0') {
      try {
        const deleteResult = await Partition.deleteOne({ _id: id });
        if (deleteResult.deletedCount !== 0) {
          return {
            information: '删除成功',
            status: '0',
            deleteResult,
          };
        }
        // 删除数量为空
        return {
          information: '删除失败',
          status: '1',
        };

      } catch (err) {
        console.log('deletePartition err信息：' + err);
        return {
          information: '删除失败',
          status: '1',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {

      try {
        // 新增 删除申请记录
        const deleteInstance = await deletePartition.create({
          partitionId: id,
          ItemId: belongItem.itemID._id,
          deleteTime: new Date(), // 申请时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: deleteData,
        });
        return {
          state: '0',
          information: '提交删除成功，请等待审核',
          deleteInstance,
        };
      } catch (err) {
        console.log('deletePartition申请 err信息：' + err);
        return {
          state: '1',
          information: '提交删除失败',
          error: err.message,
        };
      }

    }
  }

  /**
   * 新增任务中断要求
   */
  async addInterruption() {
    const data = await this.ctx.request.body;
    const Interrupt = this.ctx.model.Item.Interrupt;
    try {
      const interruptInstance = new Interrupt(data);
      await interruptInstance.save();
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
    * 删除中断要求
    */

  async deleteInterrupt(id) {
    const Interrupt = this.ctx.model.Item.Interrupt;
    const DeleteInterrupt = this.ctx.model.Item.DeleteInterrupt;
    const deleteData = await this.ctx.request.body;

    // 查询所属单品
    const belongItem = await Interrupt.findById(id).populate('itemId', 'itemState');
    console.log(belongItem);
    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (belongItem.itemState === '0') {
      try {
        const deleteResult = await Interrupt.deleteOne({ _id: id });
        if (deleteResult.deletedCount !== 0) {
          return {
            information: '删除成功',
            status: '0',
            deleteResult,
          };
        }
        // 删除数量为空
        return {
          information: '删除失败',
          status: '1',
        };

      } catch (err) {
        console.log('err信息：' + err);
        return {
          information: '删除失败',
          status: '1',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {

      try {
        // 新增 删除申请记录
        const deleteInstance = await DeleteInterrupt.create({
          interruptId: id,
          ItemId: belongItem.itemId._id,
          deleteTime: new Date(), // 申请时间
          // verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: deleteData,
        });
        return {
          state: '0',
          information: '提交删除成功，请等待审核',
          deleteInstance,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '1',
          information: '提交删除失败',
          error: err.message,
        };
      }

    }
  }

  /**
   * 更新中断要求
   */
  async updateInterrupt() {
    const Item = await this.ctx.model.Item.Item;
    const Interrupt = await this.ctx.model.Item.Interrupt;
    const InterruptUpdate = this.ctx.model.Item.Interruptupdate;
    const updatedData = await this.ctx.request.body;
    const id = await this.ctx.query._id;

    const interruptInstance = await Interrupt.findById(id);
    const belongItem = await Item.findById(interruptInstance.itemId);
    // console.log(interruptInstance, belongItem);
    try {
      // 判断单品是否上架
      if (belongItem.itemState === '0') {
        const updateResult = await Interrupt.updateOne({ _id: id }, updatedData);

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
      const upInstance = new InterruptUpdate({
        timestamp: Date.now(),
        interruptID: id, // 分区id
        // auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
        // auditorID: { type: String, default: null }, // 审核人ID
        // auditTime: { type: String, required: false }, // 审核时间
        // applyTime: Date, // 申请时间
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
   * 新增任务
   */
  async addTask() {
    const Task = this.ctx.model.Item.Task;
    const taskInstance = new Task(this.ctx.request.body);
    try {
      // const saveResult = taskInstance.save();
      await taskInstance.save();
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
   * 更新任务
   */
  async updateTask() {
    const Item = await this.ctx.model.Item.Item;
    // const Partition = await this.ctx.model.Item.Partition;
    const Task = this.ctx.model.Item.Task;
    const TaskUpdate = this.ctx.model.Item.Taskupdate;
    const updatedData = await this.ctx.request.body;
    const id = await this.ctx.query._id;

    const taskInstance = await Task.findById(id).populate('partitionId', 'itemID');
    // console.log('task实例' + taskInstance);
    const belongItem = await Item.findById(taskInstance.partitionId.itemID);
    console.log(belongItem);
    try {
      // 判断单品是否上架
      if (belongItem.itemState === '0') {
        const updateResult = await Task.updateOne({ _id: id }, updatedData);

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
      const upInstance = new TaskUpdate({
        timestamp: Date.now(),
        taskId: id, // 任务id
        // auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
        // auditorID: { type: String, default: null }, // 审核人ID
        // auditTime: { type: String, required: false }, // 审核时间
        // applyTime: Date, // 申请时间
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
   * 删除任务
   */

  async deleteTask(id) {
    const Item = this.ctx.model.Item.Item;
    const Task = this.ctx.model.Item.Task;
    const DeleteTask = this.ctx.model.Item.Deletetask;
    const deleteData = await this.ctx.request.body;

    // 查询所属单品
    const taskInstance = await Task.findById(id).populate('partitionId', 'itemID');
    // console.log(taskInstance);
    const belongItem = await Item.findById(taskInstance.partitionId.itemID);
    // console.log(belongItem);
    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (belongItem.itemState === '0') {
      try {
        const deleteResult = await Task.deleteOne({ _id: id });
        if (deleteResult.deletedCount !== 0) {
          return {
            information: '删除成功',
            status: '0',
            deleteResult,
          };
        }
        // 删除数量为空
        return {
          information: '删除失败',
          status: '1',
        };

      } catch (err) {
        console.log('err信息：' + err);
        return {
          information: '删除失败',
          status: '1',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {

      try {
        // 新增 删除申请记录
        const deleteInstance = await DeleteTask.create({
          partitionId: taskInstance.partitionId._id,
          TaskId: id,
          deleteTime: new Date(), // 申请时间
          // verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          changedData: deleteData,
        });
        return {
          state: '0',
          information: '提交删除成功，请等待审核',
          deleteInstance,
        };
      } catch (err) {
        console.log('deleteTask err信息：' + err);
        return {
          state: '1',
          information: '提交删除失败',
          error: err.message,
        };
      }

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
     * 删除单品是否也要顺便把下面的中断要求，分区，任务等等都要删除: 是的
     * 判断是否上架
     */
  async deleteItem() {
    const Item = this.ctx.model.Item.Item;
    // const Partition = this.ctx.model.Item.Partition;
    // const DeleteItem = this.ctx.model.Item.Deleteitem;
    const Category = this.ctx.model.Category;
    const deleteInstance = await Item.findById(this.ctx.query._id);
    const CategoryDelete = this.ctx.model.Deletecategory;
    const deleteData = await this.ctx.request.body;
    console.log(deleteInstance);

    // 判断品类是否上架，然后做出相应操作，0为未上架
    if (deleteInstance.categoryState === '0') {
      try {
        const deleteResult = await Category.deleteOne({ _id: this.ctx.query._id });
        if (deleteResult.deletedCount !== 0) {
          return {
            information: '删除成功',
            status: '0',
            deleteResult,
          };
        }
        // 删除数量为空
        return {
          information: '删除失败',
          status: '1',
        };

      } catch (err) {
        console.log('err信息：' + err);
        return {
          information: '删除失败',
          status: '1',
          error: err.message,
        };
      }
      // 若品类已上架，则提交修改申请
    } else {

      try {
        // 新增 删除申请记录
        const CDInstance = await CategoryDelete.create({
          categoryID: this.ctx.query._id, // 品类ID
          applyTime: new Date(), // 申请时间
          verifyTime: null, // 审核时间
          timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
          deleteData,
        });
        console.log('service层：' + CDInstance);
        return {
          state: '0',
          information: '提交删除成功，请等待审核',
          CDInstance,
        };
      } catch (err) {
        console.log('err信息：' + err);
        return {
          state: '1',
          information: '提交删除失败',
          error: err.message,
        };
      }

    }
  }

  /**
   * 上架单品
   */
  async changeState() {
    // 获取前端的id和数据
    const ItemId = await this.ctx.query._id;
    const operatorId = await this.ctx.query.operatorId;
    const Item = this.ctx.model.Item.Item;
    const Adjust = this.ctx.model.Adjust;
    const data = await Item.findById(ItemId);
    const changedData = await this.ctx.request.body; // 获取前端上下架时传下来的数据

    // 上/下架，新增记录，返回
    try {
      let upOroff = '0';
      if (data.itemState === '0') {
        upOroff = '3';
      } else {
        upOroff = '4';
      }

      const upInstance = await Adjust.create({
        object: 'I',
        operatorId,
        objectId: this.ctx.query._id,
        action: upOroff,
        verifyTime: null, // 审核时间
        timestamp: Date.now(), // 时间戳 因为model表中默认时间戳的值不会更新，所以在这里改变
        changedData,
      });

      if (upInstance) {
        const news = await this.sendNews(operatorId, ItemId, upInstance);

        return {
          information: '提交请求成功',
          status: '1',
          upInstance,
          news,
        };
      }


    } catch (err) {
      return {
        information: '提交请求失败',
        status: '0',
        error: err.message,
      };
    }
  }


}
module.exports = ItemService;
