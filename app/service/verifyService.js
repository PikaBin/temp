/**
 * 运营商审核
 */
'use strict';

const Service = require('egg').Service;

class verifyService extends Service {

  // 获取专才项目申请
  async ServicerApply_get() {
    const ServicerApply = await this.ctx.model.ServicerApply;

    // 假设第一条订单时间戳为0
    const FIRST = 0;

    // 以此来判断是否最开始一次的查询，如果是那么就为第一个订单id，如果不是则为上一次查询id
    const old = this.ctx.session.last ? this.ctx.session.last : FIRST;

    // 获取最新专才项目的申请
    const latestone = await ServicerApply.findOne().sort({ _id: -1 }); // id为索引排序，从旧到新排列
    const latest = latestone.applyTime;
    console.log('old:' + old, 'latest:' + latest);
    if (old < latest) {
      const newServicerApply = await ServicerApply.find({ applyTime: { $gt: old } });
      this.ctx.session.last = latest;
      console.log('新增品类申请' + newServicerApply);

      // 返回新增的记录内容以及新增的数量
      return {
        newServicerApply,
        amount: newServicerApply.length, // 待审核的数量
      };
    }
    // 若没有新增，就返回0
    return {
      amount: 0,
      information: '无新增专才项目申请',
    };
  }

  /**
   * 处理专才项目申请-审核
   * 申请状态(0 : 申请中，1 ：审核通过，2 ：审核不通过)
   */
  async VerifyS_apply() {
    // 获取前端审核结果
    const S_apply = await this.ctx.request.body;
    const result = S_apply.state;
    const ServicerApply = this.ctx.model.ServicerApply;

    // 审核结果 通过
    if (result === '1') {

      // 更新品类原表的信息为申请表中的信息
      const updateInfo = await ServicerApply.update({ _id: S_apply._id }, { state: result });
      console.log(updateInfo);
      // 若没有变动，则显示更新失败
      if (updateInfo.nModefied === 0) {
        return {
          verify: '0',
          information: '数据库更新失败,审核失败',
        };
      }
      // 返回更新成功
      return {
        verify: '1',
        information: '数据库更新成功，审核成功',
      };

      // 审核结果 未通过
    } else if (result === '2') {
      const updateInfo = await ServicerApply.updateOne({ _id: S_apply._id }, { reason: S_apply.reason, state: result });

      // 若没有变动，则显示更新失败
      if (updateInfo.nModefied === 0) {
        return {
          verify: '0',
          information: '数据库更新失败，审核失败',
        };
      }
      // 返回更新成功
      return {
        verify: '1',
        information: '审核成功',
        reason: S_apply.reason,
      };
    }
  }
}

module.exports = verifyService;
