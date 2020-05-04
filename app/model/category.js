'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const categorySchema = new Schema({
    categoryID: Schema.Types.ObjectId,
    categoryName: { type: String, required: true },
    categoryIntrod: { type: String, required: true },
    categoryState: { type: String, required: true, enum: [ '0', '1' ], default: '0' }, // 0为 未上架，1为已上架
    categoryLabel: { type: Schema.Types.ObjectId, ref: 'Label' },
    categoryOperator: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
    /**
     * 以下属性是品类规范（用于品类下级单品规范）
     */
    categoryExplanation: { type: String, required: true },
    categoryMinName: { type: Number, required: true },
    categoryMaxName: { type: Number, required: true },
    categoryMaxIntroduction: { type: String, required: true },
    categoryMinIntroduction: { type: String, required: true },
    categoryMaxPartition: { type: Number, required: true },
    categoryMinPartition: { type: Number, required: true },
    categoryMinTasks: { type: Number, required: true },
    categoryMaxTasks: { type: Number, required: true },
    categoryMinScore: { type: Number, required: true },
    categoryMaxTaskTime: { type: Number, required: true },
    categoryMinPrice: { type: Number, required: true },
    categoryMaxPrice: { type: Number, required: true },
    categoryMaxContent: { type: Number },
    categoryMinContent: { type: Number },
    categoryExamineTF: { type: String, required: true, default: '0' }, // 0 – 未通过上架/  1 – 通过上架/  2 – 未通过修改/  3 – 通过修改/  4 – 未通过下架/  5 – 下架
    categoryReason: { type: String },
    categoryAddTime: { type: Date, required: true },
    categoryReviseTime: { type: Date },
    categoryDeleteTime: { type: Date },
  });

  return mongoose.model('Category', categorySchema);
};
