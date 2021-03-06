'use strict';

/**
 * 工单日志表 字段设计说明：
 * 日志表的每次记录对应着单品分区的具体任务
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const workOrderlogSchema = new Schema({
    workorderId: { type: Schema.Types.ObjectId, ref: 'Workorder' }, // 所属工单
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' }, // 任务id
    start: { type: Date }, // 开始时间
    end: { type: Date }, // 结束时间
    customerfeedback: { type: String }, // 顾客点评内容
    deadline: { type: Date }, // 任务最迟完成时间点
    serverFeedbackImg: Array, // 专才反馈，图片形式
    serverFeedbackText: String, // 专才反馈，文字形式
  });

  return mongoose.model('Workorderlog', workOrderlogSchema);
};
