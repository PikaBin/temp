/**
 * 消息控制器
 */
'use strict';

const Controller = require('egg').Controller;
class NewsController extends Controller {

  // 运营商获取消息
  async getNews() {
    const result = await this.ctx.service.news.getNews();
    this.ctx.body = result;
  }

  // 改变消息阅读状态
  async setRead() {
    const result = await this.ctx.service.news.setRead();
    this.ctx.body = result;
  }
}
module.exports = NewsController;

