const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    roleId: { type: Schema.Types.ObjectId, ref: 'roles' },
    created_date: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updated_date = new Date();
    }
    next();
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;