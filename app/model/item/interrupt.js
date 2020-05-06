/**
 * 任务中断条件表
 */
'use strict';

module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const interruptSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    itemId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stage_from: String,
    stage_end: String,
    receivable: Number,
  });

  return mongoose.model('Interrupt', interruptSchema);
};
