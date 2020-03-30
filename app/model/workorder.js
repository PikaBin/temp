'use strict';

/**
 * 工单表 字段设计说明：
 * 不足：
 * 0.时间类型的属性，没有设置默认时间（因为时区转换）；
 * 1.W_itemPartition属性值是单品分区id，并不是单品id,这个能不能自动依赖
 * 2.状态码内容限定问题
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const workOrderSchema = new Schema({
    _id: Schema.Types.ObjectId,
    W_name: { type: String },
    W_servicer: { type: String, ref: 'Servicer' },
    W_itemPartition: { type: String, required: true, ref: 'Item' }, // 由于分区id删除，所以改为string
    orderID: { type: String, ref: 'Order' },
    W_operatorID: { type: Schema.Types.ObjectId, ref: 'Operator' },
    W_state: { type: String, required: true },
    W_startTime: { type: Date },
    W_endTime: { type: Date },
    W_serverTime: { type: Date },
    requirement: { type: String },
    // log: {
    //   _id: Schema.Types.ObjectId,
    //   name: { type: String, required: true },
    //   content: { type: String, required: true },
    //   start: { type: Date, required: true },
    //   end: { type: Date, required: true },
    //   Servicer_feedback: { type: String, required: true },
    //   Customer_feedback: { type: String },
    //   deadline: { type: Date },
    //   state: { type: String, required: true },
    // },
    log: Array,
  });

  return mongoose.model('Workorder', workOrderSchema);
};

