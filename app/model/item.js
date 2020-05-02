'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const itemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    itemName: { type: String, required: true },
    itemPrice: { type: String },
    itemImages: { type: Array },
    categoryID: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    itemIntroduction: { type: String, required: true },
    itemState: { type: String, required: true },
    itemExamineTF: { type: String, required: true },
    itemReason: { type: String },
    itemAddTime: { type: Date, default: Date.now() },
    itemReviseTime: { type: Date },
    itemDeleteTime: { type: Date },

  });

  return mongoose.model('Item', itemSchema);
};
