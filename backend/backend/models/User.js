const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // You forgot this import!
const uniqueValidator = require('mongoose-unique-validator');
const { CUSTOMER } = require('../config/constant');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: CUSTOMER },
  phone_number: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  resetLink: { type: String, default: '' },
  cart_entry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
  kyc_verified: { type: Boolean, default: false },
  address: { type: Object, default: null },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

// Plugin to enforce unique constraints with readable messages
UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Instance method to return user profile safely
UserSchema.methods.toProfileJSONFor = function () {
  return {
    username: this.username,
    email: this.email,
    role: this.role,
    phone_number: this.phone_number,
    verified: this.verified,
    resetLink: this.resetLink,
    cart_entry: this.cart_entry,
    kyc_verified: this.kyc_verified,
    address: this.address,
  };
};

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Only now do we export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
