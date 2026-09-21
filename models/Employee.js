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
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    joiningDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    supervisorName: {
      type: String,
      default: 'Site Supervisor',
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
