/**
 * 单品控制器
 */

'use strict';
const path = require('path');
const { Controller } = require('egg');
const fs = require('fs');
const pump = require('mz-modules/pump');

class itemController extends Controller {

  // 新增单品
  async addItem() {
    try {
      const itemInstance = await this.ctx.service.item.addItem();
      this.ctx.status = 200;
      this.ctx.body = itemInstance;
    } catch (err) {
      console.log('itemController error：' + err);
    }


  }

  // 新增任务中断要求表
  async addInterrupt() {
    try {
      const result = await this.ctx.service.item.addInterruption();
      this.ctx.body = result;
    } catch (err) {
      console.log(err);
      this.ctx.body = {
        status: '0',
        information: '新增失败',
      };
    }
  }

  // 更新任务中断要求
  async updateInterrupt() {
    const result = await this.ctx.service.item.updateInterrupt();
    this.ctx.body = result;
  }

  // 删除任务中断要求
  async deleteInterrupt() {
    const id = await this.ctx.query._id;
    const result = await this.ctx.service.item.deleteInterrupt(id);
    this.ctx.body = result;
  }

  // 新增分区表
  async addPartition() {
    const result = await this.ctx.service.item.addPartition();
    this.ctx.body = result;
  }

  // 更新分区
  async updatePartition() {
    const result = await this.ctx.service.item.updatePartition();
    this.ctx.body = result;
  }


  /**
   * 删除分区以及附属的任务
   * 注意，应该先删除附属的任务，然后才能删除分区
   */
  async deletePartition() {
    const id = await this.ctx.query._id;

    // 查询属于该分区的任务
    const attachedTask = await this.queryTask(id);

    // 删除附带的任务，并把结果存储起来
    const deleteTask = [];
    for (const task in attachedTask) {
      console.log('分区所属任务：' + task);
      const taskresult = await this.ctx.service.deleteTask(task._id);
      deleteTask.push(taskresult);
    }

    const result = await this.ctx.service.item.deletePartition(id);
    // 返回结果
    this.ctx.body = {
      result,
      deleteTask,
    };
  }

  // 新增任务
  async addTask() {
    const result = await this.ctx.service.item.addTask();
    this.ctx.body = result;
  }

  // 更新任务
  async updateTask() {
    const result = await this.ctx.service.item.updateTask();
    this.ctx.body = result;
  }

  // 根据分区id, 查询分区下的任务
  async queryTask() {
    const partitionId = await this.ctx.query._id;
    const Task = this.ctx.model.Item.Task;
    // eslint-disable-next-line object-shorthand
    const findResult = await Task.find({ partitionId: partitionId });
    console.log(findResult);
    if (findResult) {
      this.ctx.body = {
        information: '查询成功',
        status: '0',
        findResult,
      };
    } else {
      this.ctx.body = {
        information: '查询失败，查询的任务不存在',
        status: '1',
      };
    }
  }


  // 删除任务
  async deleteTask() {
    const id = await this.ctx.query._id;
    const result = await this.ctx.service.item.deleteTask(id);
    this.ctx.body = result;
  }
  // 添加单品图片
  async getPhoto() {
    // 获取表单提交的文件流
    const stream = await this.ctx.getFileStream();
    // 获取上传的文件名
    const filename = path.basename(stream.filename);
    // console.log(filename);nian.jpg

    // 拼接图片上传的目录
    const dir = await this.service.fileupload.makeUploadPath(filename);

    // 创建一个写入流
    const target = dir.uploadDir;
    console.log('target是' + target);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);
    const Item = this.ctx.model.Item;
    const item_id = this.ctx.request.query._id;
    const itemInstance = await Item.findById(item_id);
    const imagesUrl = itemInstance.itemImages; // 用来存储图片路径

    // 将图片存储路径加入到相应单品记录中
    try {

      imagesUrl.push(dir.saveDir); // 添加新图片路径

      const result = await Item.updateOne({ _id: item_id }, { itemImages: imagesUrl });
      console.log('result:' + JSON.stringify(result));
    } catch (err) {
      console.log('operatorInfo错误：' + err);
    }


    this.ctx.body = {
      url: imagesUrl,
      fields: stream.fields,
    };

  }
  /**
   * 单品查询,根据运营商id
   */
  async queryItem() {
    const options = await this.ctx.request.body;
    const queryResult = await this.ctx.service.item.queryItem(options);
    this.ctx.body = queryResult;
  }

  /**
   * 单品查询,根据单品id
   */
  async queryByItem() {
    const itemInstance = await this.ctx.service.item.queryByItem();
    this.ctx.body = itemInstance;
  }

  /**
   * 单品更新
   */
  async updateItem() {
    const updateResult = await this.ctx.service.item.updateItem();
    console.log('更新结果：' + updateResult);
    this.ctx.body = updateResult;
  }
}

module.exports = itemController;
