const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
  packageId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Package = mongoose.model('package', packageSchema);

module.exports = Package;
