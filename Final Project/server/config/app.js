let express = require('express');
let createError = require('http-errors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// Initialize express app
let app = express();

// Middleware to make `user` available globally in views
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

let userModel = require('../model/User');
let User = userModel.User;
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let expenseRouter = require('../routes/expense');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
let session = require('express-session')
let passport = require('passport')
let passportLocal = require('passport-local')
let flash = require('connect-flash');
passport.use(User.createStrategy());
let localStrategy = passportLocal.Strategy;

// MongoDB connection
const mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => { console.log("Connected with MongoDB") });

// Session setup
app.use(session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false
}));
// Flash and Passport setup
app.use(flash());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/expenseList', expenseRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;