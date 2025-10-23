const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Bills', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['one-time', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'one-time'
  }
}, {
  timestamps: true
});

// Index for faster queries
expenseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
