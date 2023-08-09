const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    resetCode: { type: String, required: true },
    expiryDate: { type: Date, required: true },
});


const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema, 'password_resets');

module.exports = PasswordReset;