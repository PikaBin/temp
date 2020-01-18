'use strict';

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ServicerSchema = new Schema({
//   // _id: Schema.Types.ObjectId,
//   

// });
// module.exports = mongoose.model('Servicer', ServicerSchema);
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ServicerSchema = new Schema({
    servicerName: { type: String, required: true },
  });

  return mongoose.model('Servicer', ServicerSchema);
};

