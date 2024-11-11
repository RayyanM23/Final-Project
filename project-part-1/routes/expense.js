var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// Telling my router that I have this model
let Expense = require('./model/expense');

/* Read Operation --> Get route for displaying the books*/
router.get('/',async(req,res,next)=>{
try{
    const expenseList = await Expense.find();
    res.render('index',{
        title:'Expense Calc',
        expenseList:expenseList
    })}
    catch(err){
        console.error(err);
        res.render('index',{
            error:'Error on the Server'
        })
    }
});