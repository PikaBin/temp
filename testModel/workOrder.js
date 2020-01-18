'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workOrderSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  W_servicer: { type: Schema.Types.ObjectId, ref: 'Servicer' },
  W_suborder: { type: Schema.Types.ObjectId, required: true, ref: 'Suborder' },
  W_task: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
  W_item: { type: Schema.Types.ObjectId, required: true, ref: 'Item' },

});
module.exports = mongoose.model('workOrder', workOrderSchema);

/**
 * 工单表 字段设计说明：
 * 1.现阶段工单是由子订单生成，这个可能要改；
 * 2. servicer 字段没有强制要求，因为工单生成时不一定就要分配给专才，
 *  这个可以作为后一步操作，而不是工单生成时就要做到的，
 */

