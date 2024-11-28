var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
let userModel = require('../model/User');
let User = userModel.User;
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var expenseRouter = require('../routes/expense');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
let session = require('express-session')
let passport = require('passport')
let passportLocal = require('passport-local')
let flash = require('connect-flash');
passport.use(User.createStrategy());
let localStrategy = passportLocal.Strategy;

const mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => { console.log("Connected with MongoDB") });
mongoose.connect(DB.URI, { useNewURIParser: true, useUnifiedTopology: true });

// Set up express-session
app.use(session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false
}));
// Initialize the flash
app.use(flash());
// serialize and deserializse the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// app.use('/', indexRouter);
app.use('/', expenseRouter);
app.use('/users', usersRouter);
app.use('/expenseList', expenseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;