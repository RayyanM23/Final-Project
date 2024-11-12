var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// Telling my router that I have this model
let Expense = require('../model/expense');

/* Read Operation --> Get route for displaying the income/expenses*/
router.get('/',async(req,res,next)=>{
try{
    const expenseList = await Expense.find();
    res.render('expense',{
        title:'Expense Calculator',
        expenseList:expenseList
    })}
    catch(err){
        console.error(err);
        res.render('expense',{
            error:'Error on the Server'
        })
    }
});

/* Create Operation --> Get route for displaying me the Add Page */
router.get('/add',async(req,res,next)=>{
    try{
        res.render('add',{
            title: 'Add Income/Expense'
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('expense',{
            error:'Error on the server'
        })
    }
});
/* Create Operation --> Post route for processing the Add Page */
router.post('/add',async(req,res,next)=>{
    try{
        let newExpense = Expense({
            "Type":req.body.Type,
            "Category":req.body.Category,
            "Details":req.body.Details,
            "Amount":req.body.Amount
        });
        Expense.create(newExpense).then(()=>{
            res.redirect('/expenseList');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('expense',{
            error:'Error on the server'
        })
    }
});

/* Update Operation --> Get route for displaying me the Edit Page */
router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const expenseToEdit= await Expense.findById(id);
        res.render('edit',
            {
                title:'Edit Income/Expense',
                Expense:expenseToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); // passing the error
    }
});
/* Update Operation --> Post route for processing the Edit Page */ 
router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedExpense = Expense({
            "_id":id,
            "Type":req.body.Type,
            "Category":req.body.Category,
            "Details":req.body.Details,
            "Amount":req.body.Amount
        });
        Expense.findByIdAndUpdate(id,updatedExpense).then(()=>{
            res.redirect('/expenseList')
        })
    }
    catch(err){
        console.error(err);
        res.render('expense',{
            error:'Error on the server'
        })
    }
});

/* Delete Operation --> Get route to perform Delete Operation */
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        Expense.deleteOne({_id:id}).then(()=>{
            res.redirect('/expenseList')
        })
    }
    catch(error){
        console.error(err);
        res.render('expense',{
            error:'Error on the server'
        })
    }
});


module.exports = router;