// Import express and create a router
const express = require('express');
const router = express.Router(); // Use router here, not app

router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('message', 'Passwords do not match');
        return res.redirect('/register');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            req.flash('message', 'Error hashing password');
            return res.redirect('/register');
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        newUser.save()
            .then(() => res.redirect('/login')) // Redirect to login page on success
            .catch(err => {
                req.flash('message', err.message);
                res.redirect('/register');
            });
    });
});

module.exports = router;