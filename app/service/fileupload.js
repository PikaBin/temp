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
   * 上传用户头像
   */
  async addImage() {
    const { ctx } = this;
    // 获取文件流
    const readStream = await ctx.getFileStream();

    // 获取文件名
    const filename = await path.basename(readStream.filename);

    // 拼接上传的路径
    const upload_path = '/images/' + filename;

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
