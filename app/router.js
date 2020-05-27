'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 注册，登录
  // router.post('/operator/signup', controller.login.signUp);
  router.get('/operator/signin', controller.login.signIn_get); // 返回验证码代码
  router.post('/operator/signin', controller.login.signIn); // 处理登录
  router.get('/operator/signin_test', controller.login.signIn_test); // 测试，返回图片

  // 运营商基础信息管理
  router.post('/manager/addoperator', controller.operatorInfo.addOperator);
  router.post('/manager/updateoperator', controller.operatorInfo.updateOperator);
  router.get('/manager/queryoperator', controller.operatorInfo.queryOperator);
  router.post('/manager/addimage', controller.operatorInfo.getPhoto); // 上传头像
  router.post('/manager/getlicense', controller.operatorInfo.getlicense); // 上传营业执照
  router.post('/manager/changepsd', controller.operatorInfo.changePassword); // 修改密码


  // 品类标签
  router.post('/manager/addlabel/', controller.label.addLabel);

  /**
   * 品类管理
   * */
  router.post('/manager/addcategory/', controller.category.addCategry); // 增加品类
  router.post('/manager/updateCategory_O/', controller.category.updateCategory_O); // 运营商提交品类修改申请
  router.get('/manager/queryCategory', controller.category.queryCategory); // 查询品类（根据前端所选条件）
  router.post('/manager/deletecategory/', controller.category.deleteCategory); // 运营商修改品类申请
  router.post('/manager/uporoff', controller.category.upOroff); // 品类上下架


  /**
   * 单品管理
   */

  // 新增
  router.post('/manager/getdata', controller.item.getData); // 获取新增的字段
  router.post('/manager/additem/', controller.item.addItem); // 新增单品
  router.post('/manager/addInterrupt', controller.item.addInterrupt); // 新增任务中断要求
  router.post('/manager/addpartition', controller.item.addPartition); // 新增单品分区
  router.post('/manager/addtask', controller.item.addTask); // 新增任务
  router.post('/manager/additemImage', controller.item.getPhoto); // 上传单品图片，测试
  router.post('/manager/changestate', controller.item.uporOff); // 单品上下架

  // 查询
  router.get('/manager/queryitem', controller.item.queryItem); // 单品查询，根据运营商id
  router.get('/manager/querybyitem', controller.item.queryByItem); // 单品查询,根据单品id
  router.get('/manager/querytask', controller.item.queryTask); // 查询任务，根据分区id
  router.get('/manager/querypartition', controller.partition.queryPartition); // 根据单品分区id,查询单品信息

  // 更新
  router.post('/manager/updatepartition', controller.item.updatePartition); // 更新分区
  router.post('/manager/updateinterrupt', controller.item.updateInterrupt); // 更新中断要求
  router.post('/manager/updateitem', controller.item.updateItem); // 单品更新
  router.post('/manager/updatetask', controller.item.updateTask); // 任务更新

  // 删除
  router.post('/manager/deleteInterrupt', controller.item.deleteInterrupt); // 删除中断请求
  router.delete('/manager/deletetask', controller.item.deleteTask); // 删除任务
  router.delete('/manager/deletepartition', controller.item.deletePartition); // 删除分区以及附带的任务


  /**
   * 工单管理
   */
  router.get('/manager/neworder', controller.workorder.findOrder); // 返回新增订单
  router.post('/manager/workorderadd', controller.workorder.workorderAdd); // 自动新增工单
  router.get('/manager/workorderadd', controller.workorder.workorderAdd); // 返回系统自动新增的工单
  router.get('/manager/assign_get', controller.workorder.assignGet); // 返回可供分配的专才列表
  router.post('/manager/assignpost', controller.workorder.assignPost); // 派单

  router.post('/manager/workorderadd_man', controller.workorder.workorderAdd_man); // 手动增加工单
  router.post('/manager/addworkorderlog/', controller.workorder.workorderlog_man); // 手动增加工单日志
  router.post('/manager/assign', controller.workorder.assign_man); // 手动增加派单
  router.post('/manager/refuse', controller.workorder.refuse); // 拒单处理 测试
  router.get('/manager/checklog', controller.workorder.checkWorkorder); // 查看工单反馈

  // 查询
  router.get('/manager/queryworkorder', controller.workorder.queryworkorder); // 查询工单

  // 专才管理
  router.get('/manager/verifyServicerApply_get', controller.verify.getServicerApply); // 获取专才项目申请记录
  router.post('/manager/verifyServiceApply_post/', controller.verify.verifySericeApply); // 审核 专才申请
  router.post('/manager/addcontract', controller.servicer.addContract); // 添加合约表
  router.get('/manager/querycontract', controller.servicer.queryContract); // 查看合约表
  router.get('/manager/queryapply', controller.servicer.queryServicerApply); // 查看专才申请
  router.post('/manager/verifyservicer', controller.servicer.verifyApply); // 处理专才申请

  /**
   * 消息管理
   */
  router.get('/manager/getnews', controller.news.getNews); // 运营商获取平台消息
  router.post('/manager/setread', controller.news.setRead); // 消息阅读状态改变

  /**
   * 专才管理
   */
  router.get('/manager/queryservicer', controller.servicer.queryServicer); // 查询专才

  /**
   * 数据分析
   */

  // 销售额
  router.get('/manager/operatorsale', controller.analysis.operatorSale); // 运营商总额
  router.get('/manager/operatoronmonth', controller.analysis.operatorOnMonth); // 本月销售额
  router.get('/manager/operatoronyear', controller.analysis.operatorOnYear); // 本年销售额

  // 成交量
  router.get('/manager/totalcount', controller.analysis.totalcount); // 总成交量
  router.get('/manager/countonday', controller.analysis.countOnDay); // 日成交量
  router.get('/manager/countonmonth', controller.analysis.countOnMonth); // 月成交量
  router.get('/manager/countonyear', controller.analysis.countOnYear); // 年成交量

  // 实收款
  router.get('/manager/totalcash', controller.analysis.totalCash); // 实收账款
  router.get('/manager/cashonmonth', controller.analysis.cashOnMonth); // 本月实收账款
  router.get('/manager/cashonyear', controller.analysis.cashOnYear); // 本年实收账款

  // 实付款
  router.get('/manager/totaldebt', controller.analysis.totaldebt); // 应付总额
  router.get('/manager/debtonmonth', controller.analysis.debtOnMonth); // 月应付
  router.get('/manager/debtonYear', controller.analysis.debtOnYear); // 年应付

  // 专才排行榜
  router.get('/manager/servicerRank', controller.analysis.servicerank); // 专才排行榜

  // 工单分析
  router.get('/manager/totalworkorder', controller.analysis.totalworkorder); // 工单总数
  router.get('/manager/workorderonmonth', controller.analysis.workorderOnMonth); // 每月工单
  router.get('/manager/workorderonyear', controller.analysis.workorderOnYear); // 每年工单
  router.get('/manager/badworkorder', controller.analysis.badworkorder); // 意外中止的工单总数
  router.get('/manager/badworkorderonmonth', controller.analysis.badworkorderOnMonth); // 意外中止 本月
  router.get('/manager/badworkorderonyear', controller.analysis.badworkorderOnYear); // 意外中止 本年
  router.get('/manager/goodworkorder', controller.analysis.goodworkorder); // 顺利完成 总数
  router.get('/manager/goodworkorderonmonth', controller.analysis.goodworkorderOnMonth); // 顺利完成 本月
  router.get('/manager/goodworkorderonyear', controller.analysis.goodworkorderOnYear); // 顺利完成 本月
  router.get('/manager/partitonRank', controller.analysis.partitionRank); // 单品排行榜
};
