'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const pump = require('pump');

class UploadMoreService extends Service {

  // 上传多文件的表单
  async uploadMore() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true }); // 前端配置form
    let stream;
    const files = [];
    while ((stream = await parts()) !== null) {
      if (!stream || !stream.filename) {
        break;
      }
      // 表单的名字
      const { filename } = stream;
      console.log(filename);
      // 上传图片的目录
      const dir = await this.ctx.service.fileupload.makeUploadPath(filename);
      console.log('上传路径：', dir);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files.push(dir.saveDir);// 写入文件存储的路径
    }
    return {
      files,
      fields: parts.field,
    };


  }

}
module.exports = UploadMoreService;
