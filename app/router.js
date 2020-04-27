'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 注册，登录
  router.post('/operator/signup', controller.login.signUp);
  router.get('/operator/signin', controller.login.signIn_get); // 返回验证码图片
  router.post('/operator/signin', controller.login.signIn); // 处理登录

  // 运营商基础信息管理
  router.post('/manager/addoperator', controller.operatorInfo.addOperator);
  router.get('/manager/updateoperator_get', controller.operatorInfo.updateOperator_get); // 用来返回csrf值
  router.post('/manager/updateoperator', controller.operatorInfo.updateOperator);
  router.get('/manager/queryoperator', controller.operatorInfo.queryOperator);
  router.post('/manager/addimage', controller.operatorInfo.getPhoto); // 上传图片


  // 品类标签
  router.post('/manager/addlabel/', controller.label.addLabel);
  // 品类管理
  router.post('/manager/addcategory/', controller.category.addCategry);
  // 单品管理
  router.post('/manager/additem/', controller.item.addItem);

  // 工单管理
  router.get('/manager/neworder', controller.workorder.findOrder); // 返回新增订单
  router.post('/manager/workorderadd', controller.workorder.workorderAdd); // 手动新增工单
  router.get('/manager/workorderadd', controller.workorder.workorderAdd); // 返回系统自动新增的工单

};
