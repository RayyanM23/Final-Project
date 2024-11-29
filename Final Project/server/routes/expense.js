var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Expense = require('../model/expense');

// Read Operation --> Get route for displaying the income/expenses
router.get('/', async(req, res, next) => {
    try {
        const expenseList = await Expense.find();
        res.render('Expense/expense', {
            title: 'Expense Calculator',
            displayName: req.user ? req.user.displayName : '',
            expenseList: expenseList
        });
    } catch (err) {
        console.error(err);
        res.render('Expense/expense', {
            error: 'Error on the Server'
        });
    }
});

// Create Operation --> Get route for displaying the Add Page
router.get('/add', async(req, res, next) => {
    try {
        res.render('Expense/add', {
            title: 'Add Income/Expense',
            displayName: req.user ? req.user.displayName : ''
        });
    } catch (err) {
        console.error(err);
        res.render('Expense/expense', {
            error: 'Error on the server'
        });
    }
});

// Create Operation --> Post route for processing the Add Page
router.post('/add', async(req, res, next) => {
    if (!req.user) { // If the user is not logged in
        return res.render('Auth/login', { // Redirect to the login page
            errorMessage: 'You must be logged in to add an expense.' // Show the error message
        });
    }

    try {
        // Create a new expense only if the user is logged in
        let newExpense = new Expense({
            Type: req.body.Type,
            Category: req.body.Category,
            Details: req.body.Details,
            Amount: req.body.Amount,
            user: req.user._id // Link the expense to the logged-in user's ID
        });

        // Save the new expense to the database
        await Expense.create(newExpense);
        res.redirect('/expenseList'); // Redirect to the expense list after successful creation
    } catch (err) {
        console.error(err);
        res.render('Expense/expense', { error: 'Error on the server' });
    }
});


// Update Operation --> Get route for displaying the Edit Page
router.get('/edit/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const expenseToEdit = await Expense.findById(id);
        res.render('Expense/edit', {
            title: 'Edit Income/Expense',
            displayName: req.user ? req.user.displayName : '',
            Expense: expenseToEdit
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Update Operation --> Post route for processing the Edit Page
router.post('/edit/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let updatedExpense = {
            "_id": id,
            "Type": req.body.Type,
            "Category": req.body.Category,
            "Details": req.body.Details,
            "Amount": req.body.Amount
        };
        await Expense.findByIdAndUpdate(id, updatedExpense);
        res.redirect('/expenseList');
    } catch (err) {
        console.error(err);
        res.render('Expense/expense', {
            error: 'Error on the server'
        });
    }
});

// Delete Operation --> Get route to perform Delete Operation
router.get('/delete/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        await Expense.deleteOne({ _id: id });
        res.redirect('/expenseList');
    } catch (error) {
        console.error(error);
        res.render('Expense/expense', {
            error: 'Error on the server'
        });
    }
});

// Define the route for `/expenseList` here
router.get('/expenseList', (req, res) => {
    res.render('Expense/expense', {
        user: req.user, // Ensure `user` is passed properly
        title: 'Expense List'
    });
});

module.exports = router;