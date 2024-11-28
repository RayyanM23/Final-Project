var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var flash = require('connect-flash');

// Initialize express app
var app = express();

// Middleware to make `user` available globally in views
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

let userModel = require('../model/User');
let User = userModel.User;
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var expenseRouter = require('../routes/expense');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// MongoDB connection
const mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
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
passport.use(User.createStrategy());
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

// Define routes
app.get('/Auth/register', (req, res) => {
    res.render('register', { message: req.flash('message') });
});

app.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        req.flash('message', 'Passwords do not match');
        return res.redirect('/register');
    }

    // Create new user
    const newUser = new User({
        username,
        email,
        password,
    });

    // Save user to database
    newUser.save()
        .then(() => res.redirect('/login')) // Redirect to login page after successful registration
        .catch(err => {
            req.flash('message', err.message);
            res.redirect('/register'); // If error, stay on register page
        });
});

// Routes
app.use('/', expenseRouter);
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