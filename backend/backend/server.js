const express = require('express');

console.log('Server is starting...')

const app = express();

console.log('Express is starting...')

// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

console.log('Mongoose is starting...')

// const flash = require('connect-flash');
const session = require('express-session');

console.log('Session is starting...')


const passport = require('passport');

console.log('Passport is starting...')


const server = require('http').createServer(app)

console.log('Server is created...')

const bodyParser = require('body-parser')

console.log('Body Parser is starting...')

require('express-async-errors')
const cors = require('cors')


const setupSwagger = require('./swagger');

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var isProduction = process.env.NODE_ENV === 'production';

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

require('dotenv').config();

module.exports = {
    jwt_key: process.env.JWT_KEY
  };
  

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose.set("strictQuery", false);

console.log('MongoDB is connecting...')

  try {
    const db = require('./config/key').MongoURI;
    console.log(db);
  } catch (err) {
    console.error('Error loading config:', err);
  }

mongoose.set('debug', true);

//mongoose.connect('mongodb://127.0.0.1:27017/oasis');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
    console.log('MongoDB is connected...'); 
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'secret',
        cookie: {maxAge: 60000},
        resave: true,
        saveUninitialized: true
    })
);

console.log('Session is configured...')

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

console.log('Routes is configured...')
//------------ Routes ------------//
app.use('/api', require('./routes/index'));

console.log('Index is configured...')

app.use('/auth', require('./routes/auth'));

setupSwagger(app); 

console.log('Auth is configured...')

//------------ middleware ------------//
app.use(require('./middlewares/ErrorHandler'))

console.log('Middleware is configured...')

app.use((req, res, next) => {
	res.status(404).json({
		code: 404,
		message: 'Not found',
	})
})

/// error handlers

app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);
  res.status(err.status || 500).json({
    type: 'SERVER_ERROR',
    message: err.message || 'Unexpected error occurred.',
  });
});
console.log('Error handling is configured...')



// development error handler
// will print stacktrace
console.log('Production is configured...')
if (!isProduction) {
    app.use(function(err, req, res, next) {
      console.log(err.stack);

      res.status(err.status || 500);

      res.json({'errors': {
        message: err.message,
        error: err
      }});
    });
  }

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});

console.log('Server is running...')
const PORT = process.env.PORT || 50

console.log('Server is starting...')

server.listen(PORT, function() {
    console.log(`Server running on PORT ${PORT}`);
});
