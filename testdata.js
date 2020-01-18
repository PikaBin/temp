'use strict';

console.log('本脚本用来向数据库填充项目测试数据，');
const mongoose = require('mongoose');
const async = require('async');

// 连接数据库
// 从命令行取出参数
const userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('错误：需要指定一个合法的 MongoDB URL 作为第一个参数。');
  return;

}

// mongodb://admin:admin123@123.57.254.158:27017/test?authSource=admin 这里路径后的test为数据库名称
// mongodb://admin:admin123@59.110.162.236:27017/test?authSource=admin
// 连接数据库
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;// 这一句用意何在

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
// 引入相关模型
const Item = require('./testModel/item');
const Servicer = require('./testModel/servicer');
const Order = require('./testModel/order');
const Task = require('./testModel/task');
const WorkOrder = require('./testModel/workOrder');
const Category = require('./testModel/category');
const Customer = require('./testModel/customer');
const Rule = require('./testModel/rule');

// 存储数据，数据调用
const item = [];
const servicer = [];
const order = [];
const task = [];
const workOrder = [];
const category = [];
const rule = [];
const customer = [];

// 客户
function customerCreate(account, psd, id, callback) {

  const customerInstance = new Customer({
    CustomerZhanghao: account,
    Password: psd,
    CustomerID: id,

  });

  customerInstance.save(err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建客户：' + customerInstance);
    customer.push(customerInstance);
    callback(null, customerInstance);

  });
}

// 品类规则
function ruleCreate(name, introd, callback) {

  const ruleInstance = new Rule({
    _id: new mongoose.Types.ObjectId(),
    ruleName: name,
    ruleIntrod: introd,
  });

  ruleInstance.save(err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建品类规则：' + ruleInstance);
    rule.push(ruleInstance);
    callback(null, ruleInstance);

  });
}

// 品类
function categoryCreate(name, introd, rule, callback) {

  const categoryInstance = new Category({
    categoryName: name,
    categoryIntrod: introd,
    categoryRule: rule,
  });

  categoryInstance.save(err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建品类：' + categoryInstance);
    category.push(categoryInstance);
    callback(null, categoryInstance);

  });
}

// 单品
function itemCreate(name, category, callback) {

  const itemInstance = new Item({
    _id: new mongoose.Types.ObjectId(),
    itemName: name,
    itemcategory: category,
  });

  itemInstance.save(err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建单品：' + itemInstance);
    item.push(itemInstance);
    callback(null, itemInstance);

  });
}

// 专才
function servicerCreate(name, callback) {

  const servicerInstance = new Servicer({
    // _id: id,
    servicerName: name,
  });

  servicerInstance.save((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建专才：' + servicerInstance);
    servicer.push(servicerInstance);
    callback(null, data);

  });
}

// 订单
function orderCreate(item, customer, amount, callback) {

  const orderInstance = new Order({
    Orderitem: item,
    Ordercustomer: customer,
    OrderbuyTime: new Date(),
    Orderamount: amount,
  });

  orderInstance.save(err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建订单：' + orderInstance);
    order.push(orderInstance);
    callback(null, orderInstance);

  });
}

// 任务 task
function taskCreate(name, callback) {

  const taskInstance = new Task({
    // _id: id,
    taskName: name,
  });

  taskInstance.save((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建任务：' + taskInstance);
    task.push(taskInstance);
    callback(null, data);

  });
}

// 工单 workorder

function workorderCreate(item, servicer, task, suborder, callback) {

  const workorderInstance = new WorkOrder({
    // _id: id,
    W_servicer: servicer,
    W_suborder: suborder,
    W_task: task,
    W_item: item,
  });

  workorderInstance.save((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('新建工单：' + workorderInstance);
    workOrder.push(workorderInstance);
    callback(null, data);

  });
}

// **** 填充测试数据************ */

// 客户
function createCustomer(cb) {
  async.parallel([
    cb => customerCreate('98354', 'abcde', '00000002', cb),
    cb => customerCreate('44895', '098acn', '00000003', cb),
  ], cb);
}

// 品类规则
function createRule(cb) {
  async.parallel([
    cb => ruleCreate('时效性', '服务是否及时', cb),
    cb => ruleCreate('态度友好性', '服务过程是否诚心诚意', cb),
  ], cb);
}

// 品类
function createCategory(cb) {
  async.parallel([
    cb => categoryCreate('理财', '对财务（财产和债务）进行管理，以实现财务的保值、增值为目的', rule[0], cb),
    cb => categoryCreate('公司运营', '对公司运营过程的计划、组织、实施和控制', rule[1], cb),
  ], cb);
}

// 单品
function createItem(cb) {
  async.parallel([
    cb => itemCreate('记账', category[0], cb),
    cb => itemCreate('商标注册', category[1], cb),
  ], cb);
}


// 专才
function createServicer(cb) {
  async.parallel([
    cb => servicerCreate('张龙', cb),
    cb => servicerCreate('赵虎', cb),
    cb => servicerCreate('王朝', cb),
    cb => servicerCreate('马汉', cb),
  ], cb);
}

// 订单
function createSuborder(cb) {
  async.parallel([
    cb => orderCreate(item[0], customer[0], 1, cb),
    cb => orderCreate(item[1], customer[1], 2, cb),
    cb => orderCreate(item[0], customer[0], 1, cb),
  ], cb);
}

// 任务
function createTask(cb) {
  async.parallel([
    cb => taskCreate('任务1', cb),
    cb => taskCreate('任务2', cb),
    cb => taskCreate('任务3', cb),
  ], cb);
}

// 工单
function createWorkorder(cb) {
  async.parallel([
    cb => workorderCreate(item[0], servicer[0], task[0], order[0], cb),
    cb => workorderCreate(item[1], servicer[1], task[1], order[1], cb),
    cb => workorderCreate(item[0], servicer[2], task[1], order[0], cb),
  ], cb);
}

async.series([
  createCustomer,
  createRule,
  createCategory,
  createItem,
  createServicer,
  createSuborder,
  createTask,
  createWorkorder,
],

err => {
  err
    ? '最终错误：' + err
    : '新建订单：' + order;
  // 断开数据库
  db.close();
}
);
