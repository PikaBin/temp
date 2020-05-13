/* eslint-disable no-unused-vars */
/**
 * 模拟消息服务
 */
'use strict';

const Service = require('egg').Service;
class NewsService extends Service {

  /**
  * 接受平台端传来的审核消息，获取新增消息
  */
  async receiveVerify() {
    const News = this.ctx.model.Verify.News;

    // 假设第一条消息时间戳为0,获取上一次最新的消息时间戳
    const firstNews = 0;
    const lastOne = this.ctx.session.news ? this.ctx.session.news : firstNews;

    // 查询现有数据库中最新的时间戳
    const latest = await News.findOne().sort({ _id: -1 });
    const latestOne = latest.timestamp;
    let news = []; // 用来存储新增的消息
    // 判断是否有新增消息
    if (lastOne < latestOne) {
      // 有新增消息，然后查询
      news = await News.find({ timestamp: { $gt: lastOne } });
      this.ctx.session.news = latestOne; // 更新session为最新的
    }

    return {
      news,
      amount: news.length,
      information: '新增的消息内容与数量',
    };
  }

  /**
   * 返回发给运营商的所有消息
   */
  async getNews() {
    const News = this.ctx.model.Verify.News;
    const query = this.ctx.query;
    console.log(query);
    // const id = this.ctx.query._id;
    // const r = this.ctx.query.read;
    try {
      const findresult = await News.find(query);

      if (findresult.length !== 0) {
        return {
          information: '查询成功',
          status: '1',
          findresult,
        };
      }

      // 查询为空
      return {
        information: '查询为空',
        status: '0',
      };
    } catch (err) {
      console.log('getNews: ' + err);
      return {
        information: '查询失败',
        status: '0',
        error: err.message,
      };
    }
  }
}

module.exports = NewsService;
