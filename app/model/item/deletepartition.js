'use strict';
/**
 * @param {object} app
 * 删除分区 申请表
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const deleteSchema = new Schema({
    timestamp: { type: Number, default: Date.now() }, // 时间戳
    partitionId: { type: String, required: true },
    ItemId: { type: String, required: true }, // 所属单品id
    auditResult: { type: String, default: '0' }, // 审核结果 0: 未审核，1：审核通过， 2：审核不通过
    auditorID: { type: String, default: null }, // 审核人ID
    auditTime: { type: String, required: false }, // 审核时间
    deleteTime: { type: Date, default: new Date() }, // 申请时间
    changedData: { type: Schema.Types.Mixed }, // 因为修改而更新的数据
  });
  return mongoose.model('Deletepartition', deleteSchema);
};
