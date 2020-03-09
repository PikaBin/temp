'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const assginSchema = new Schema({
    _id: Schema.Types.ObjectId,
    state: { type: String, required: true },
    serverID: { type: Schema.Types.ObjectId, ref: 'Servicer', required: true },
    endTime: Date,
    log: [ Schema.Types.ObjectId ],
  });
  return mongoose.model('Assgin', assginSchema);
};
