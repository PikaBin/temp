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

  // 新增分区表
  async addPartition() {
    const result = await this.ctx.service.item.addPartition();
    this.ctx.body = result;
  }

  // 新增任务
  async addTask() {
    const result = await this.ctx.service.item.addTask();
    this.ctx.body = result;
  }


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

  async queryItem() {
    const queryResult = await this.ctx.service.item.queryItem();
    this.ctx.body = queryResult;
  }
}

module.exports = itemController;
