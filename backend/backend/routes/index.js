const express = require('express');
const router = express.Router();

console.log('[Router Init] Importing dependencies...');
const { ROLE } = require('../config/constant');
const AuthMiddleware = require('../middlewares/Authentication');

let UserRouter, NyxcipherRouter, ItemRouter, TicketRouter, PaymentRouter;

try {
    console.log('[Router Init] Requiring route modules...');
    UserRouter = require('./user');
    console.log('[Router Init] Requiring route user...');
    NyxcipherRouter = require('./nyxcipher');
    console.log('[Router Init] Requiring route nyxcipher...');
    ItemRouter = require('./item');
    console.log('[Router Init] Requiring route item...');
    TicketRouter = require('./ticket');
    console.log('[Router Init] Requiring route ticket...');
    //PaymentRouter = require('./payment');

    console.log('[Router Init] All route modules required successfully.');
} catch (err) {
    console.error('[Router Init Error] Failed to require route modules:', err);
    throw err; // Stop further execution if something failed
}

//------------ Welcome Route ------------//
router.get('/', AuthMiddleware(["Customer", "Sponsor"]), (req, res) => {
    console.log('[Route] GET / hit with authenticated user.');
    res.status(200).send({ data: 'Welcome Oasis' });
});

try {
    console.log('[Router Init] Mounting /user route...');
    router.use('/user', UserRouter);

    console.log('[Router Init] Mounting /nyxcipher route...');
    router.use('/nyxcipher', NyxcipherRouter);

    console.log('[Router Init] Mounting /item route...');
    router.use('/item', ItemRouter);

    console.log('[Router Init] Mounting /ticket route...');
    router.use('/ticket', TicketRouter);

    //console.log('[Router Init] Mounting /payment route...');
    //router.use('/payment', PaymentRouter);

    console.log('[Router Init] All routes mounted successfully.');
} catch (err) {
    console.error('[Router Init Error] Failed to mount one or more routers:', err);
}

module.exports = router;
