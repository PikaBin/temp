'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  _id: Schema.Types.ObjectId,
  itemName: { type: String, required: true },
  itemcategory: { type: Schema.Types.ObjectId, ref: 'Category', required: true },

});
module.exports = mongoose.model('Item', ItemSchema);

/**
 * 单品表，包含以下属性：
 * 单品id,单品名称，所属品类，
 */
