const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    manpowerCount: {
      type: Number,
      default: 10,
    },
    roleRequirement: {
      type: String,
      default: 'General Industrial Operators',
    },
    shiftsRequired: {
      type: String,
      default: '2 Shifts (16 Hours)',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Under Review', 'Contacted', 'Deployed', 'Closed'],
      default: 'New',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Proposal', proposalSchema);
