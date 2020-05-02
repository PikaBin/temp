/**
 * 运营商审核控制器
 */
'use strict';

const Controller = require('egg').Controller;
class VerifyController extends Controller {

  // 获取专才项目申请的待审核记录
  async getServicerApply() {
    try {
      const S_apply = await this.ctx.service.verifyService.ServicerApply_get();
      this.ctx.body = S_apply;
    } catch (err) {
      console.log('err信息：' + err);
      this.ctx.body = {
        status: '0',
        notice: '获取失败',
      };
    }

  }

  // 处理专才项目申请-审核
  async verifySericeApply() {
    try {
      const verifyResult = await this.ctx.service.verifyService.VerifyS_apply();
      this.ctx.body = verifyResult;
    } catch (err) {
      console.log('err信息：' + err);
      this.ctx.body = {
        status: '0',
        information: '审核失败',
      };
    }
  }
}

module.exports = VerifyController;
