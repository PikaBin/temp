'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 注册，登录
  router.post('/operator/signup', controller.login.signUp);

  // 运营商基础信息管理
  router.post('/manager/addoperator', controller.operatorInfo.addOperator);
  router.post('/manager/updateoperator', controller.operatorInfo.updateOperator);
  router.get('/manager/queryoperator', controller.operatorInfo.queryOperator);
  router.post('/manager/addimage', controller.operatorInfo.getPhoto);


  // 品类标签
  router.post('/manager/addlabel/', controller.label.addLabel);
  // 品类管理
  router.post('/manager/addcategory/', controller.category.addCategry);
  // 单品管理
  router.post('/manager/additem/', controller.item.addItem);


};
