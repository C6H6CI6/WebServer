const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const errorHandler = require('errorhandler');

const muta = require('./blockchains/muta.js')
const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

/**
 * Create Express server.
 */
const app = express();

// View engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "secret"}));
app.use('/', express.static('public/dist'));
app.use(indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

/**
 * Error Handler.
 */
app.use(errorHandler());
/* app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server Error');
});*/

module.exports = app;
