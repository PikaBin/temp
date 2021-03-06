/**
 * 运营商与专才的合约表
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SOcontractSchema = new Schema({
  _id: Schema.Types.ObjectId,
  contractName: { type: String, required: true },
  class: { type: String, required: true },
  state: { type: String, required: true },
  servicerID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true },
  operatorID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true },
  shar: { type: Number, ref: 'Servicer', required: true },
  minScore: { type: Number },
  maxOrderTimeout: { type: Number, ref: 'Servicer', required: true },
  minOrder: { type: Number, required: true },
  maxOrder: { type: Number, required: true },
  minCompletionRate: { type: Number, required: true },
  minCompletionTime: { type: Date, required: true },
  maxCompletionTime: { type: Date, required: true },
  minProfit: { type: Number, required: true },

});

module.exports = mongoose.model('SOcontract', SOcontractSchema);
