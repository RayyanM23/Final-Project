const mongoose = require("mongoose");

let expenseModel = mongoose.Schema({
    Name: String
},
{
    collection:"Expense"
});
module.exports = mongoose.model('expense',expenseModel);
