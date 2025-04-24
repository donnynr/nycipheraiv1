//const UserServices = require('../services/UserServices')
const { NotFoundError, ValidationError, BadRequestError } = require('../utils/errors')
const {ROLE} = require('../config/constant')

const User = require('../models/User')
const registerValidation = require('../validators/registerValidation');
const { validationResult } = require('express-validator')
const generateResetToken = require('../utils/generateResetToken');
const sendResetEmail = require('../utils/sendResetEmail');

// ----------------- Customers ------------------ //
/*exports.getNyxciphers = async (req, res) => {
    const nyxciphers = await UserServices.getNyxciphers(req.email)
	res.status(200).json(nyxciphers)
}

exports.getNyxcipher = async (req, res) => {
    const nyxcipher = await UserServices.getNyxcipher(req.email, req.params.id)
	res.status(200).json(nyxcipher)
}

exports.getActiveNyxciphers = async (req, res) => {
    console.log("getActive")
    const nyxciphers = await UserServices.getActiveNyxciphers(req.email)
	res.status(200).json(nyxciphers)
}

exports.getClosedNyxciphers = async (req, res) => {
    const nyxciphers = await UserServices.getClosedNyxciphers(req.email)
	res.status(200).json(nyxciphers)
}

exports.getProfile = async (req, res) => {
    const user = await UserServices.getProfile(req.email)
	res.status(200).json(user)
}

exports.addMyCart = async (req, res) => {
    const carts = await UserServices.addMyCart(req.email, req.body)
	res.status(200).json(carts)
}

exports.deleteMyCart = async (req, res) => {
    const carts = await UserServices.deleteMyCart(req.email, req.params.id)
	res.status(200).json(carts)
}

exports.saveProfile = async (req, res) => {
    // const user = await UserServices.saveProfile(req.)
    res.status(200).json('post respond')
}

exports.updateProfile = async (req, res) => {
    console.log("updatedprofle")
    const user = await UserServices.updateProfile(req.email, req.body)
    res.status(200).json(user)
}

exports.deleteProfile = async (req, res) => {
    // const user = await UserServices.deleteProfile(req.)
    res.status(200).json('del respond')
}


// ----------------- Owner ------------------ //
exports.getCustomers = async (req, res) => {
    const customers = await User.find({"role": ROLE.CUSTOMER})
	res.status(200).json(customers)
}

exports.getSponsors = async (req, res) => {
    const sponsors = await User.find({"role": ROLE.SPONSOR})
	res.status(200).json(sponsors)
}

exports.saveSponsor = async (req, res) => {
    const sponsor = await UserServices.saveSponsor(req.headers, req.body)
    res.status(200).json(sponsor)
}

exports.updatePerson = async (req, res) => {
    const person = await UserServices.updatePerson(req.params.id, req.body)
    res.status(200).json(person)
}

exports.deletePerson = async (req, res) => {
    const persons = await UserServices.deletePerson(req.params.id)
    res.status(200).json(persons)
}*/

exports.registerUser = [
    // Run validations first
    ...registerValidation,
  
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Format express-validator errors
        const formattedErrors = errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        }));
        return res.status(400).json({ type: 'VALIDATION_ERROR', errors: formattedErrors });
      }
  
      const { email, password, username } = req.body;
  
      try {
        const user = new User({ email, password, username });
        const savedUser = await user.save();
  
        res.status(201).json({ message: 'User registered successfully', user: savedUser.toProfileJSONFor() });
    } catch (err) {
        // Detect duplicate key errors (E11000 is MongoDB’s code for it)
        if (err.code === 11000) {
          const field = Object.keys(err.keyValue)[0];
          return res.status(409).json({
            type: 'DUPLICATE_ERROR',
            error: `${field} "${err.keyValue[field]}" is already taken.`,
          });
        }
  
        console.error('[Unhandled Error]', err);
        return res.status(500).json({ type: 'SERVER_ERROR', message: 'Something went wrong.' });
      }
    }
  ];

  exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Email not found' });
  
      const { token, expiry } = generateResetToken();
      user.resetToken = token;
      user.resetTokenExpiry = expiry;
      await user.save();
  
      await sendResetEmail(user.email, token); // Implement email logic
  
      res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error requesting password reset.' });
    }
  };

  
  exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
  
      if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  
      user.password = newPassword; // Pre-save hook will hash it
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error resetting password.' });
    }
  };
  
