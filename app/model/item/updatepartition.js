'use strict';
/**
 * @param {object} app
 * 品类上下架
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const updatePartitionSchema = new Schema({
    timestamp: { type: Number, default: Date.now() }, // 时间戳
    partitionID: { type: String, required: true }, // 品类id
    auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
    auditorID: { type: String, default: null }, // 审核人ID
    auditTime: { type: String, required: false }, // 审核时间
    updateTime: { type: Date, default: new Date() }, // 更改时间
    changedData: { type: Schema.Types.Mixed }, // 因为修改而更新的数据
  });
  return mongoose.model('Updatepartition', updatePartitionSchema);
};
