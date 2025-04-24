const express = require('express')
const router = express.Router()
const {ROLE} = require('../config/constant')

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const registerValidation = require('../validators/registerValidation');
const User = require('../models/User');


const AuthMiddleware = require('../middlewares/Authentication')
const UserController = require('../controllers/UserController')

// customer
/*router.get('/me', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.getProfile)
router.get('/me/nyxcipher/list', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.getNyxciphers)
router.get('/me/nyxcipher/:id', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.getNyxcipher)
router.get('/me/active/nyxcipher/list', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.getActiveNyxciphers)
router.get('/me/closed/nyxcipher/list', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.getClosedNyxciphers)
router.post('/me/cart', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.addMyCart)
router.delete('/me/cart/:id', AuthMiddleware([ROLE.CUSTOMER, ROLE.SPONSOR, ROLE.OWNER]), UserController.deleteMyCart)

router.post('/me', AuthMiddleware(ROLE.CUSTOMER), UserController.saveProfile)
router.put('/me', AuthMiddleware(ROLE.CUSTOMER), UserController.updateProfile)
router.delete('/me', AuthMiddleware, UserController.deleteProfile)

// owner
router.get('/customers', AuthMiddleware(ROLE.OWNER), UserController.getCustomers)
router.get('/sponsors', AuthMiddleware(ROLE.OWNER), UserController.getSponsors)
router.post('/sponsor', AuthMiddleware(ROLE.OWNER), UserController.saveSponsor)
router.put('/:id', AuthMiddleware(ROLE.OWNER), UserController.updatePerson)
router.delete('/:id', AuthMiddleware(ROLE.OWNER), UserController.deletePerson)
*/

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', UserController.registerUser);

/**
 * @swagger
 * /api/user/request-reset:
 *   post:
 *     summary: Request password reset
 *     tags:
 *       - Auth
 *     description: Sends a password reset token to the user's email if the email exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset link sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */
router.post('/request-reset', UserController.requestPasswordReset);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Auth
 *     description: Resets the user's password using a valid token sent to their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: 123456abcdef
 *               newPassword:
 *                 type: string
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.post('/reset-password', UserController.resetPassword);

module.exports = router