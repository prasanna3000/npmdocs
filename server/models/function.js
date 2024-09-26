const mongoose = require('mongoose');
const { Schema } = mongoose;

const functionSchema = new Schema({
  functionId: {
    type: String,
    required: true,
    unique: true,
  },
  functionName: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    ref: 'Package',
    required: true,
  },
  documentation: {
    type: String,
    required: true,
  },
}, { timestamps: true });

functionSchema.index({ functionName: 1, package: 1 }, { unique: true });

const FunctionDocumentation = mongoose.model('function', functionSchema);

module.exports = FunctionDocumentation;
