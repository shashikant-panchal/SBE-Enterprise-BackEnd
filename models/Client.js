const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    assignedWorkers: {
      type: Number,
      default: 0,
    },
    activeShifts: {
      type: [String],
      default: [],
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contractStatus: {
      type: String,
      default: 'Active',
    },
    logoPlaceholder: {
      type: String,
      default: 'SBE',
    },
    deploymentSince: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Client', clientSchema);
