var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/Auth/register', (req, res) => {
    res.render('register');
});

router.get('/Auth/login', (req, res) => {
    res.render('login');
});

module.exports = router;