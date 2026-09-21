const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
      trim: true,
    },
    nativeState: {
      type: String,
      default: 'Karnataka',
    },
    nativeDistrict: {
      type: String,
      default: '',
    },
    clientCompany: {
      type: String,
      required: true,
    },
    clientLocation: {
      type: String,
      default: 'Mysore',
    },
    shift: {
      type: String,
      default: 'Shift A (06:00 - 14:00)',
    },
    phone: {
      type: String,
      default: '',
    },
    aadhaarVerified: {
      type: Boolean,
      default: true,
    },
    medicalFitnessValid: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'In Reserve', 'On Leave'],
      default: 'Active',
    },
    experienceYears: {
      type: Number,
      default: 1,
    },
    dailyWageRate: {
      type: Number,
      default: 550,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
