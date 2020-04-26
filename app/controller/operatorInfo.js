/* eslint-disable quotes */
/**
 * 运营商基础信息controller
 */
'use strict';

const { Controller } = require('egg');

class OperatorInfoController extends Controller {

  /** 新增运营商 */
  async addOperator() {

    // 获取前端数据
    // const requestData = await this.ctx.request.body;
    // console.log('前端获取的数据：' + JSON.stringify(requestData));

    try {
      // 调用Service方法
      const operatorInstance = await this.service.operatorInfo.addOperator();
      // 对前端进行响应
      this.ctx.body = operatorInstance;
      this.ctx.status = 201;
    } catch (err) {
      console.log(err);
      this.ctx.body = "页面出现了未知错误";
    }

  }
  /**
   * 更新运营商基础信息并返回更新后的信息
   */
  async updateOperator() {
    // 获取前端数据
    // const req = await this.ctx.request.body;
    // console.log('前端数据' + req);
    try {
      const updatedData = await this.service.operatorInfo.updateOperator();
      // console.log(updatedData);
      this.ctx.body = updatedData;
      this.ctx.status = 201;
    } catch (err) {
      console.log(err);
      this.ctx.body = "页面出现了未知错误";
    }
  }

  /**
   * 查询运营商基础信息并返回
   */
  async queryOperator() {
    // 获取前端数据
    // const req = await this.ctx.query._id;
    // console.log('req数据:' + req);
    try {
      const foundData = await this.service.operatorInfo.queryOperator();
      if (foundData) {
        this.ctx.body = foundData;
        this.ctx.status = 201;
      } else {
        this.ctx.body = '查无结果';
      }

    } catch (err) {
      console.log(err);
      this.ctx.body = "页面出现了未知错误";
    }
  }

  /**
   * 前端上传头像
   */
  async getPhoto() {
    const id = this.ctx.query.id; // 暂时从前端通过查询参数 传入用户id，因为没有掌握session
    const photoPath = await this.ctx.service.fileupload.addImage();
    const Operator = this.ctx.model.Operator;

    try {
      const result = await Operator.findByIdAndUpdate(id, { legalPersonPhoto: photoPath }, function(err, doc) {
        if (err) console.log(err);
        else {
          return doc;
        }
      });
      console.log('result:' + result);
      this.ctx.body = photoPath;
      this.ctx.status = 200;
    } catch (err) {
      console.log('operatorInfo错误：' + err);
    }
  }
}

module.exports = OperatorInfoController;

