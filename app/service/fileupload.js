/* eslint-disable no-unused-vars */
/**
 * 先实现单文件上传，
 * 注意事项：只支持单文件上传，而且上传的文件必须放在表单最后的字段
 */
'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
class UploadSingle extends Controller {

  /**
   * 上传用户头像，写入数据库图片路径，并且将图片路径返回给前端
   */
  async addImage() {
    const { ctx } = this;
    // 获取文件流
    const readStream = await ctx.getFileStream();

    // 获取文件名,包括扩展名
    const filename = await path.basename(readStream.filename);

    // 拼接上传的路径,注意这里 // 路径符号可能与服务器路径符号不一致,这里先暂时做测试使用
    const upload_path = path.join('D:/images/', filename);
    // fs.mkdirSync(this.config.upload, { recursive: true }); // 递归创建目录

    // 如果路径不存在就创建
    const stat = fs.statSync('D:/images/');
    if (!stat.isDirectory()) {
      fs.mkdirSync('D:/images/');
    }

    // 创建写入流
    const writeStream = fs.createWriteStream(upload_path);

    let result;
    try {
      result = await readStream.pipe(writeStream);
    } catch (err) {
    // 上传失败，销毁流
      await sendToWormhole(readStream);
      throw err;
    }
    return upload_path;
  }
}

module.exports = UploadSingle;
