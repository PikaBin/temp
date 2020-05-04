'use strict';
/**
 * @param {object} app
 * 品类上下架
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const categoryJudgeSchema = new Schema({
    timestamp: { type: Number, default: Date.now() }, // 时间戳
    categoryID: { type: String, required: true }, // 品类id
    auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
    auditorID: { type: String, default: null }, // 审核人ID
    auditTime: { type: String, required: false }, // 审核时间
    applyTime: Date,
    action: { type: String }, // up:上架，off:下架
  });
  return mongoose.model('CategoryJudge', categoryJudgeSchema);
};
