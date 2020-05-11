'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi,egg';
    // ctx.session.visited = ctx.session.visited ? (ctx.session.visited + 1) : 1;
    // console.log(ctx.session.vv);
    // ctx.body = 'hi, egg' + ctx.session.visited + count;
  }


}

module.exports = HomeController;
