'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CadeleteSchema = new Schema({
    categoryID: { type: String, required: true }, // 品类ID
    auditorID: { type: String, default: null }, // 审核员ID
    applyTime: { type: Date, required: true }, // 申请时间
    verifyTime: { type: Date }, // 审核时间
    Result: { type: String, required: true, default: '0' }, // 审核结果 0为审核中，1为审核成功，2为审核未通过，默认为0
    timestamp: { type: Number, default: Date.now() }, // 时间戳
    deleteData: { type: Schema.Types.Mixed }, // 存放因删除而与数据库不一致的数据
  });

  return mongoose.model('Categorydelete', CadeleteSchema);
};
