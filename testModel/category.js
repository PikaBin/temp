'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
//  categoryID: Schema.Types.ObjectId,mongodb会自动添加id
  categoryName: { type: String, required: true },
  categoryIntrod: { type: String, required: true },
  //  evalute_indicator: { type: Schema.Types.ObjectId, ref: 'Evalute' },
  categoryRule: { type: Schema.Types.ObjectId, ref: 'Rule', required: true },
  // categoryQuality: { type: Schema.Types.ObjectId, ref: 'Quality' },
});

module.exports = mongoose.model('Category', CategorySchema);
