'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const servicerApplySchema = new Schema({
    servicerId: { type: String, required: true }, // 专才ID
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true }, // 单品ID
    operatorId: { type: Schema.Types.ObjectId, required: false, default: new mongoose.Types.ObjectId('5ead80ee74243c4bc453abfd') }, // 运营商id5ead80ee74243c4bc453abfd
    itemName: { type: String, required: false }, // 项目名称
    certificates: { type: Array, required: false }, // 技能证书 是照片
    skillDescribe: { type: String, required: true }, // 能力描述
    state: { type: String, required: true }, // 申请状态(0 : 申请中，1 ：审核通过，2 ：审核不通过)
    reason: { type: String, required: false }, // 审核不通过，发送修改理由或者其他信息
    timestamp: { type: Number, required: true, default: Date.now() }, // 提交申请的时间戳
    applyTime: { type: Date, required: true, default: new Date() }, // 提交申请的时间
  });
  return mongoose.model('ServicerApply', servicerApplySchema);
};
